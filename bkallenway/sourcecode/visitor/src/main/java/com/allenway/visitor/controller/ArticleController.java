package com.allenway.visitor.controller;

import com.allenway.commons.constant.ArticleVote;
import com.allenway.commons.exception.ex.DataNotFoundException;
import com.allenway.commons.exception.ex.OperationFailException;
import com.allenway.commons.page.PageHandler;
import com.allenway.commons.response.ReturnTemplate;
import com.allenway.utils.validparam.ValidUtil;
import com.allenway.visitor.entity.Article;
import com.allenway.visitor.entity.Comment;
import com.allenway.visitor.entity.Tag;
import com.allenway.visitor.service.ArticleService;
import com.allenway.visitor.service.CommentService;
import com.allenway.visitor.service.ModuleService;
import com.allenway.visitor.service.TagService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.websocket.server.PathParam;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by wuhuachuan on 16/3/9.
 */

@Slf4j
@RestController
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @Autowired
    private TagService tagService;

    @Autowired
    private CommentService commentService;

    @Autowired
    private ModuleService moduleService;

    /**
     * 新增一篇文章
     */
    @RequestMapping(value = "/auth/article/new",method = RequestMethod.POST)
    public Object saveArticle(final Article article){

        log.debug("article = {}.",article);

        //验证参数
        if(!isArticleValid(article)){
            log.error("article = {}.",article);
            throw new IllegalArgumentException("article is invalid");
        }

        //验证 tagId 是否合理
        if(!StringUtils.hasText(article.getId())){
            Tag tag = tagService.findById(article.getTagId());
            tag.setArticleNum(tag.getArticleNum() + 1);
            tagService.save(tag);
        }

        article.setModuleId(tagService.findById(article.getTagId()).getModuleId());

        articleService.save(article);
        return new ReturnTemplate();
    }

    /**
     * 删除文章
     */
    @RequestMapping(value = "/auth/article/delete",method = RequestMethod.POST)
    public Object deleteArticleById(final @PathParam("id") String id,
                                    final @PathParam("status") String status){

        log.debug("id = {},status = {}",id,status);

        if(!StringUtils.hasText(id) || !StringUtils.hasText(status)){
            throw new IllegalArgumentException("id or status is null or empty");
        }
        if(!status.equals("true") && !status.equals("false")){
            throw new IllegalArgumentException("status is illegal");
        }

        Article article = articleService.findById(id);

        if(article == null){
            log.error("id = {}.",id);
            throw new DataNotFoundException("article is null based on id");
        }

        if(status.equals("true")){
            //设置 tag 的 文章数量 - 1
            Tag tag = tagService.findById(article.getTagId());
            tag.setArticleNum(tag.getArticleNum() - 1);
            tagService.save(tag);

            //删除该 article 下的所有评论
            List<Comment> comments = commentService.findByArticleId(id);
            if(!CollectionUtils.isEmpty(comments)){
                comments.parallelStream().forEach(comment ->{
                    comment.setIsDelete(true);
                });
            }
            commentService.saveall(comments);

            article.setIsDelete(true);
        } else {
            //设置 tag 的 文章数量 + 1
            Tag tag = tagService.findById(article.getTagId());

            if(tag.getIsDelete() == true){
                throw new OperationFailException("tag is delete");
            }

            tag.setArticleNum(tag.getArticleNum() + 1);
            tagService.save(tag);

            //恢复该 article 下的所有评论
            List<Comment> comments = commentService.findByArticleIdIgnoreIsDelete(id);
            if(!CollectionUtils.isEmpty(comments)){
                comments.parallelStream().forEach(comment ->{
                    comment.setIsDelete(false);
                });
            }
            commentService.saveall(comments);

            article.setIsDelete(false);
        }

        articleService.save(article);
        return new ReturnTemplate();
    }

    /**
     * 查找某一篇文章
     */
    @RequestMapping(value = {"/article/{id}"},method = RequestMethod.GET)
    public Object findArticleById(final @PathVariable("id") String id) {

        log.debug("id = {}.",id);

        if(!StringUtils.hasText(id)){
            throw new IllegalArgumentException("id is null or empty");
        }

        Article article = articleService.findById(id);

        if(article == null){
            log.error("id = {}.",id);
            throw new DataNotFoundException("article is null based on id");
        }

        //阅读量 + 1
        article.setReadNum(article.getReadNum() + 1);
        articleService.save(article);

        setCommentsForArticle(article);

        return new ReturnTemplate(article);
    }

    /**
     * 查找某个 module 下的 article （分页）(isDelete = false) 主要给用户使用
     */
    @RequestMapping(value = {"/module/{moduleName}/article"},method = RequestMethod.GET)
    public Object findAllArticlesByModuleName(final @PathVariable("moduleName") String moduleName,
                                              final @RequestParam(value="page",required=false,defaultValue="1") int page,
                                              final @RequestParam(value="size",required=false,defaultValue="10") int size){

        log.debug("moduleName = {}. page = {}. size = {}.",moduleName,page,size);

        if(!isModuleNameValid(moduleName)){
            log.error("moduleName = {}.",moduleName);
            throw new IllegalArgumentException("moduleName is invalid");
        }

        if(!ValidUtil.validPageAndSize(page,size)){
            log.error("page = {}.size = {}.",page,size);
            throw new IllegalArgumentException("page or size is invalid");
        }

        return new ReturnTemplate(articleService.findByModuleIfAndInPage(new PageHandler(size,page),
                                                                         moduleService.findByName(moduleName).getId()));
    }

    /**
     * 查找某个 tag 下的 article （分页）(isDelete = false) 主要给用户使用
     */
    @RequestMapping(value = {"/tag/{tagId}/articles"},method = RequestMethod.GET)
    public Object findAllArticlesByTagId(final @PathVariable("tagId") String tagId,
                                         final @RequestParam(value="page",required=false,defaultValue="1") int page,
                                         final @RequestParam(value="size",required=false,defaultValue="30") int size){

        log.debug("tagId = {}. page = {}. size = {}.",tagId,page,size);

        if(!isTagIdValid(tagId)){
            log.error("tagId = {}.",tagId);
            throw new IllegalArgumentException("tagId is invalid");
        }

        if(!ValidUtil.validPageAndSize(page,size)){
            log.error("page = {}.size = {}.",page,size);
            throw new IllegalArgumentException("page or size is invalid");
        }

        return new ReturnTemplate(articleService.findByTagIdAndInPage(new PageHandler(size,page),tagId).getContent());
    }

    /**
     * 查找某个 tag 下的 article （分页）(isDelete = false and true) 主要给管理员使用
     */
    @RequestMapping(value = {"/auth/tag/{tagId}/articles"},method = RequestMethod.GET)
    public Object findAllArticlesByTagIdForAdmin(final @PathVariable("tagId") String tagId,
                                                 final @RequestParam(value="page",required=false,defaultValue="1") int page,
                                                 final @RequestParam(value="size",required=false,defaultValue="30") int size){

        log.debug("tagId = {}. page = {}. size = {}.",tagId,page,size);

        if(!isTagIdValid(tagId)){
            log.error("tagId = {}.",tagId);
            throw new IllegalArgumentException("tagId is invalid");
        }

        if(!ValidUtil.validPageAndSize(page,size)){
            log.error("page = {}.size = {}.",tagId);
            throw new IllegalArgumentException("tagId is invalid");
        }

        return new ReturnTemplate(articleService.findByTagIdAndInPageForAdmin(new PageHandler(size,page),tagId).getContent());
    }

    /**
     * 检查 moduleName 是否合理
     */
    private boolean isModuleNameValid(final String moduleName) {
        if(!StringUtils.hasText(moduleName)){
            return false;
        }
        if(moduleService.findByName(moduleName) == null){
            return false;
        }
        return true;
    }

    /**
     * 随机查找一篇文章
     * @return
     */
    @Deprecated
    @RequestMapping(value = "/article/find-random-article",method = RequestMethod.GET)
    public Object findRandomArticle(){

        List<Article> articles = articleService.findRandomArticle(1);

        if(!CollectionUtils.isEmpty(articles)){
            articles.get(0).setCommentList(commentService.findByArticleId(articles.get(0).getId()));
        }

        return new ReturnTemplate(articles.get(0));
    }

    /**
     * 点赞或者点踩
     */
    @Deprecated
    @RequestMapping(value = "/article/vote",method = RequestMethod.POST)
    public Object vote(final @PathParam("vote") String vote,
                       final @PathParam("id") String id){

        log.debug("id = {}. vote = {}.",id,vote);

        if(!ValidUtil.validIdParam(id)){
            log.error("id = {}.",id);
            throw new IllegalArgumentException("id is invalid");
        }

        if(!ArticleVote.UP.getKey().equals(vote) && !ArticleVote.DOWN.getKey().equals(vote)){
            log.error("vote = {}.",id);
            throw new IllegalArgumentException("vote is invalid");
        }

        Article article = articleService.findById(id);

        if(article == null){
            throw new DataNotFoundException();
        }


        if(ArticleVote.DOWN.getKey().equals(vote)){
            article.setDown(article.getDown() + 1);
        } else {
            article.setUp(article.getUp() + 1);
        }

        articleService.save(article);
        return new ReturnTemplate();
    }

    /**
     * 获得首页文章数据
     */
    @Deprecated
    @RequestMapping(value = {"/article/index"},method = RequestMethod.GET)
    public Object findIndexArticles(final @RequestParam(value="size",required=false,defaultValue="10") int size){

        log.debug("size = {}.",size);

        if(size <= 0){
            log.error("size = {}.",size);
            throw new IllegalArgumentException("size <= 0");
        }

        List<Article> articles = articleService.findByIsTop();
        List<Article> returnData = null;

        //没有置顶文章
        if(CollectionUtils.isEmpty(articles)){
            returnData = articleService.findRandomArticle(size);
        }

        //有置顶文章,并且 size < 要求返回的 size 数量
        if(!CollectionUtils.isEmpty(articles) && (articles.size() < size)){
            returnData = articles;
            returnData.addAll(articleService.findRandomArticle(size - articles.size()));
        }

        //有置顶文章,并且 size = 要求返回的 size 数量
        if(!CollectionUtils.isEmpty(articles) && (articles.size() == size)){
            returnData = articles;
        }

        //有置顶文章,并且 size > 要求返回的 size 数量
        if(!CollectionUtils.isEmpty(articles) && (articles.size() > size)){
            returnData = new ArrayList<>(size);
            for (int i = 0; i < size; ++i){
                returnData.add(articles.get(i));
            }
        }

        return new ReturnTemplate(returnData);
    }

    /**
     * 查找全部的文章 ( isDelete = false ) 主要给用户调用
     * @return
     */
    @Deprecated
    @RequestMapping(value = "/article/findall",method = RequestMethod.GET)
    public Object findall(){
        return new ReturnTemplate(articleService.findall());
    }

    /**
     * 查找全部的文章 ( isDelete = false and true ) 主要给管理员调用
     * @return
     */
    @Deprecated
    @RequestMapping(value = "/auth/article/findall",method = RequestMethod.GET)
    public Object findallForAdmin(){
        return new ReturnTemplate(articleService.findallForAdmin());
    }

    private void setCommentsForArticle(Article article){
        article.setCommentList(commentService.findByArticleId(article.getId()));
    }

    @Deprecated
    private void setCommentsForArticles(List<Article> articles){
        if(!CollectionUtils.isEmpty(articles)){
            articles.parallelStream().forEach(article -> {
                article.setCommentList(commentService.findByArticleId(article.getId()));
            });
        }
    }

    private boolean isTagIdValid(final String tagId) {
        if(!StringUtils.hasText(tagId)){
            return false;
        }
        return tagService.findById(tagId) != null;
    }

    private boolean isArticleValid(final Article article) {
        if(article == null){
            return false;
        }
        if(!StringUtils.hasText(article.getTitle())){
            return false;
        }
        if(!StringUtils.hasText(article.getContent())){
            return false;
        }
        if(!StringUtils.hasText(article.getTagId())){
            return false;
        }
        return tagService.findById(article.getTagId()) != null;
    }
}
