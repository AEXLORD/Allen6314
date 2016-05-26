package com.allenway.visitor.controller;

import com.allenway.infrustructure.exception.DataNotFoundException;
import com.allenway.utils.response.ReturnTemplate;
import com.allenway.utils.validparam.ValidUtils;
import com.allenway.visitor.entity.*;
import com.allenway.visitor.service.*;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by wuhuachuan on 16/3/9.
 */

@Data
@Slf4j
@RestController
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @Autowired
    private ClassifyService classifyService;

    @Autowired
    private TagService tagService;

    @Autowired
    private Article_TagService article_tagService;

    @Autowired
    private CommentService commentService;

    /**
     * 添加文章(包括新增的和修改的)
     * @param article
     * @return
     */
    @RequestMapping(value = "/auth/article/save-article",method = RequestMethod.POST)
    public Object saveArticle(Article article, HttpServletRequest request){

        ReturnTemplate returnTemplate = new ReturnTemplate();
        if(validArticleParam(article,request)){

            Classify classify = classifyService.findClassifyById(request.getParameter("classifyId"));
            if(classify == null){
                throw new DataNotFoundException();
            } else {
                article.setClassifyId(classify.getId());
            }

            //获得 tag1,tag2(可选),tag(可选)
            Tag tag1 = tagService.findTagById(request.getParameter("tagId1"));
            Tag tag2 = null;
            Tag tag3 = null;
            if(!StringUtils.isEmpty(request.getParameter("tagId2"))){
                tag2 = tagService.findTagById(request.getParameter("tagId2"));
            }
            if(!StringUtils.isEmpty(request.getParameter("tagId3"))){
                tag3 = tagService.findTagById(request.getParameter("tagId3"));
            }

            if(tag1 == null){
                throw new DataNotFoundException();
            } else {

                //如果新增一篇文章,那么该分类的文章 + 1,该标签下的文章分类 + 1
                if(StringUtils.isEmpty(article.getId())){
                    classify.setArticleNum(classify.getArticleNum() + 1);
                    classifyService.save(classify);

                    tag1.setArticleNum(tag1.getArticleNum() + 1);
                    tagService.save(tag1);

                    if(tag2 != null){
                        tag2.setArticleNum(tag2.getArticleNum() + 1);
                        tagService.save(tag2);
                    }
                    if(tag3 != null){
                        tag1.setArticleNum(tag3.getArticleNum() + 1);
                        tagService.save(tag3);
                    }
                }

                Article art = articleService.save(article);

                //保存article 和 tag 的关系
                article_tagService.save(new Article_Tag(art.getId(),tag1.getId()));
                if(tag2 != null){
                    article_tagService.save(new Article_Tag(art.getId(),tag2.getId()));
                }
                if(tag3 != null){
                    article_tagService.save(new Article_Tag(art.getId(),tag3.getId()));
                }
            }
        } else {
            throw new IllegalArgumentException("param is invalid!");
        }

        return returnTemplate;
    }

    /**
     * 验证添加的文章的参数合理性
     * @param article
     * @return
     */
    private boolean validArticleParam(Article article,HttpServletRequest request) {

        log.info("validArticleParam function ... article = {}, tagId1 = {}.tagId2 = {}. tagId3 = {}."
                ,article,request.getParameter("tagId1"),request.getParameter("tagId2"),request.getParameter("tagId3"));
        if(StringUtils.isEmpty(article.getTitle()) ||
                StringUtils.isEmpty(article.getContent()) ||
                !ValidUtils.validIdParam(request.getParameter("classifyId"))){
            return false;
        } else {
            if(ValidUtils.validIdParam(request.getParameter("tagId1")) &&
                    ValidUtils.validIdParam(request.getParameter("tagId2")) &&
                    ValidUtils.validIdParam(request.getParameter("tagId3"))) {
                return false;
            } else{
                return true;
            }
        }
    }


    /**
     * 删除 文章
     * @param id
     * @return
     */
    @RequestMapping(value = "/auth/article/delete-article-by-id",method = RequestMethod.POST)
    public Object deleteArticleById(@RequestParam String id){

        ReturnTemplate returnTemplate = new ReturnTemplate();
        if(ValidUtils.validIdParam(id)){
            Article article = articleService.findArticleById(id);

            if(article == null){
                throw new DataNotFoundException("article == null");
            } else {
                //该Tag下的文章数量 -1
                List<Article_Tag> article_Tags = article_tagService.findByArticleId(article.getId());
                article_Tags.parallelStream().forEach(
                        param -> {
                            Tag tag = tagService.findTagById(param.getTagId());
                            tag.setArticleNum(tag.getArticleNum() - 1);
                            tagService.save(tag);
                        }
                );

                //该分类下的文章 -1
                Classify classify = classifyService.findClassifyById(article.getClassifyId());
                classify.setArticleNum(classify.getArticleNum() - 1);
                classifyService.save(classify);

                //删除文章和 tag 的联系
                article_tagService.deleteByArticleId(article.getId());

                //删除文章和 classify 的联系
                //由于article 维护两者的关系,所以无需处理

                //删除文件和 comment 的联系
                commentService.deleteByArticleId(article.getId());

                //删除文章
                articleService.delete(article);
            }
        } else {
            throw new IllegalArgumentException("Param is invalid!");
        }
        return returnTemplate;
    }

    /**
     * 根据 Id 查找某一篇文章
     * @param id
     * @return
     */
    @RequestMapping(value = {"/article/find-article-by-id","/auth/article/find-article-by-id"},method = RequestMethod.GET)
    public Object findArticleById(String id) {

        ReturnTemplate returnTemplate = new ReturnTemplate();
        if(ValidUtils.validIdParam(id)){
            Article article = articleService.findArticleById(id);

            if(article == null){
                throw new DataNotFoundException("article == null");
            } else {
                setArticleTagClassifyComment(article);
                returnTemplate.addData("article",article);
            }
        } else {
            throw new IllegalArgumentException("Param is invalid!");
        }
        return returnTemplate;
    }

    /**
     * 获取全部的文章
     * @return
     */
    @RequestMapping(value = {"/article/get-all-articles","/auth/article/get-all-articles"},method = RequestMethod.GET)
    public Object getAllArticles(){
        log.info("getAllArticles function ... ");

        ReturnTemplate returnTemplate = new ReturnTemplate();
        returnTemplate.addData("articles",articleService.findAllArticles());

        return  returnTemplate;
    }

    /**
     * 获取特定分类下的全部的文章
     * @return
     */
    @RequestMapping(value = {"/article/get-all-articles-by-classify/{classifyId}","/auth/article/get-all-articles-by-classify/{classifyId}"},method = RequestMethod.GET)
    public Object getAllArticlesByClassify(@PathVariable("classifyId") String classifyId){
        log.info("getAllArticlesByClassify function ... ");

        if(ValidUtils.validIdParam(classifyId)){
            ReturnTemplate returnTemplate = new ReturnTemplate();
            List<Article> articles = articleService.findArticlesByClassifyId(classifyId);
            articles
                    .parallelStream()
                    .forEach(param -> setArticleTagClassifyComment(param));
            returnTemplate.addData("articles",articles);

            return  returnTemplate;
        } else {
            throw new IllegalArgumentException();
        }
    }


    /**
     * 给文章设置 Tag, Classify,Comment,因为这些都是手动维护，不是数据库帮维护
     * @param article
     */
    public void setArticleTagClassifyComment(Article article) {

        //得到该文章的 classify
        Classify classify = classifyService.findClassifyById(article.getClassifyId());
        article.setClassifyName(classify.getName());

        //得到该文章的 tag
        List<Article_Tag> article_tags = article_tagService.findByArticleId(article.getId());
        final List<Tag> tags = new LinkedList<Tag>();

        article_tags
                .parallelStream()
                .forEach(param ->{
                    Tag tag = tagService.findTagById(param.getTagId());
                    tags.add(tag);
                });

        article.setTags(tags);

        //得到该文章的 comment
        List<Comment> comments = commentService.findByArticleId(article.getId());
        article.setComments(comments);
        article.setCommentNum(comments.size());
    }



    /**
     * 找出某一Tag 分类下的文章
     * @param tagId
     * @return
     */
    @RequestMapping(value = {"/article/find-articles-by-tag/{tagId}","/auth/article/find-articles-by-tag/{tagId}"},method = RequestMethod.GET)
    public Object findArticlesByTagId(@PathVariable("tagId")String tagId){

        if(ValidUtils.validIdParam(tagId)){
            ReturnTemplate returnTemplate = new ReturnTemplate();
            List<Article> articles = articleService.findArticlesByTagId(tagId);
            returnTemplate.addData("articles",articles);
            return returnTemplate;
        } else {
            throw new IllegalArgumentException();
        }
    }

    @RequestMapping(value = {"/article/get-recommend-articles","/auth/article/get-recommend-articles"},method = RequestMethod.GET)
    public Object findRecommendArticles(){
        ReturnTemplate returnTemplate = new ReturnTemplate();
        returnTemplate.addData("recommendArticles",articleService.findRecommendArticles());
        return  returnTemplate;
    }


}
