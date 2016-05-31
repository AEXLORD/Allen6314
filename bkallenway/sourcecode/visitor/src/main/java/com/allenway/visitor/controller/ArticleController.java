package com.allenway.visitor.controller;

import com.allenway.infrustructure.exception.DataNotFoundException;
import com.allenway.utils.response.ReturnTemplate;
import com.allenway.utils.validparam.ValidUtils;
import com.allenway.visitor.entity.Article;
import com.allenway.visitor.entity.Tag;
import com.allenway.visitor.service.ArticleService;
import com.allenway.visitor.service.TagService;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

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
    private TagService tagService;

    @RequestMapping(value = "/auth/article/save-article",method = RequestMethod.POST)
    public Object saveArticle(Article article, HttpServletRequest request){
        validArticleParam(article,request);
        //设置 moduleId
        article.setModuleId(tagService.findTagById(article.getTagId()).getModuleId());
        articleService.saveArticle(article);
        return new ReturnTemplate();
    }


    /**
     * 验证添加的文章的参数合理性,暂时为了 saveArticle() 函数服务
     * @param article
     * @return
     */
    private void validArticleParam(Article article,HttpServletRequest request) {
        if(StringUtils.isEmpty(article.getTitle())){
            throw new DataNotFoundException("title is not find");
        } else if(StringUtils.isEmpty(article.getContent())){
            throw new DataNotFoundException("content is not find");
        } else if(!ValidUtils.validIdParam(request.getParameter("tagId"))){
            throw new DataNotFoundException("tagId is not find or tagId is invalid");
        }
    }


    @RequestMapping(value = "/auth/article/delete-article-by-id",method = RequestMethod.POST)
    public Object deleteArticleById(String id){
        if(ValidUtils.validIdParam(id)){
            Article article = articleService.findArticleById(id);
            if(article == null){
                throw new DataNotFoundException("get article id, but article == null");
            } else {
                articleService.deleteArticle(article);
                return new ReturnTemplate();
            }
        } else {
            throw new IllegalArgumentException("id is invalid(null or sql attck)");
        }
    }


    @RequestMapping(value = {"/article/find-article-by-id","/auth/article/find-article-by-id"}
            ,method = RequestMethod.GET)
    public Object findArticleById(String id) {
        if(ValidUtils.validIdParam(id)){
            Article article = articleService.findArticleById(id);
            if(article == null){
                throw new DataNotFoundException("get article id, but article == null");
            } else {
                ReturnTemplate returnTemplate = new ReturnTemplate();
                returnTemplate.addData("article",articleService.findArticleById(id));
                return returnTemplate;
            }
        } else {
            throw new IllegalArgumentException("id is invalid(null or sql attck)");
        }
    }


    @RequestMapping(value = {"/article/find-all-articles","/auth/article/find-all-articles"}
            ,method = RequestMethod.GET)
    public Object findAllArticles(){
        ReturnTemplate returnTemplate = new ReturnTemplate();
        returnTemplate.addData("articles",articleService.findAllArticles());
        return  returnTemplate;
    }


    @RequestMapping(value = {"/article/find-articles-by-tagid","/auth/article/find-articles-by-tagid"}
            ,method = RequestMethod.GET)
    public Object findArticlesByTagId(String tagid) {
        if (ValidUtils.validIdParam(tagid)) {
            ReturnTemplate returnTemplate = new ReturnTemplate();
            returnTemplate.addData("articles", articleService.findArticlesByTagId(tagid));
            return returnTemplate;
        } else {
            throw new IllegalArgumentException("tagId is invalid(null or sql attck)");
        }
    }

    @RequestMapping(value = "/article/find-random-article",method = RequestMethod.GET)
    public Object findRandomArticle(){
        ReturnTemplate returnTemplate = new ReturnTemplate();
        returnTemplate.addData("article",articleService.findRandomArticle());
        return returnTemplate;
    }

    @RequestMapping(value = {"/article/find-all-articles-by-moduleid","/auth/article/find-all-articles-by-moduleid"}
            ,method = RequestMethod.GET)
    public Object findAllArticlesByModule(String moduleId){
        ReturnTemplate returnTemplate = new ReturnTemplate();
        returnTemplate.addData("articles",articleService.findAllArticlesByModuleId(moduleId));
        return  returnTemplate;
    }
}
