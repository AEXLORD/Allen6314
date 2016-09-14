package com.allenway.visitor.controller;

import com.allenway.commons.constant.ArticleVote;
import com.allenway.commons.exception.DataNotFoundException;
import com.allenway.commons.page.PageHandler;
import com.allenway.commons.response.ReturnTemplate;
import com.allenway.utils.validparam.ValidUtil;
import com.allenway.visitor.entity.Article;
import com.allenway.visitor.entity.Tag;
import com.allenway.visitor.service.ArticleService;
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

    @RequestMapping(value = "/auth/article/new",method = RequestMethod.POST)
    public Object saveArticle(final Article article){

        log.debug("article = {}.",article);

        if(!isArticleValid(article)){
            log.error("article = {}.",article);
            throw new IllegalArgumentException("article is invalid");
        }

        if(StringUtils.isEmpty(article.getId())){
            Tag tag = tagService.findById(article.getTagId());
            tag.setArticleNum(tag.getArticleNum() + 1);
            tagService.save(tag);
        }

        articleService.save(article);
        return new ReturnTemplate();
    }

    @RequestMapping(value = "/article/findall",method = RequestMethod.GET)
    public Object findall(){
        return new ReturnTemplate(articleService.findall());
    }

    private boolean isArticleValid(final Article article) {
        if(article == null){
            return false;
        }
        if(StringUtils.isEmpty(article.getTitle())){
            return false;
        }
        if(StringUtils.isEmpty(article.getContent())){
            return false;
        }
        if(StringUtils.isEmpty(article.getTagId())){
            return false;
        }
        return tagService.findById(article.getTagId()) != null;
    }

    @RequestMapping(value = "/auth/article/delete",method = RequestMethod.POST)
    public Object deleteArticleById(final @PathParam("id") String id){

        log.debug("id = {}",id);

        if(StringUtils.isEmpty(id)){
            throw new IllegalArgumentException("id is null or empty");
        }

        Article article = articleService.findById(id);

        if(article == null){
            log.error("id = {}.",id);
            throw new DataNotFoundException("article is null based on id");
        }

        Tag tag = tagService.findById(article.getTagId());
        tag.setArticleNum(tag.getArticleNum() - 1);
        tagService.save(tag);

        articleService.delete(article);
        return new ReturnTemplate();
    }

    @RequestMapping(value = {"/article/{id}"},method = RequestMethod.GET)
    public Object findArticleById(final @PathVariable("id") String id) {

        log.debug("id = {}.",id);

        if(StringUtils.isEmpty(id)){
            throw new IllegalArgumentException("id is null or empty");
        }

        Article article = articleService.findById(id);

        if(article == null){
            log.error("id = {}.",id);
            throw new DataNotFoundException("article is null based on id");
        }

        article.setReadNum(article.getReadNum() + 1);
        articleService.save(article);

        return new ReturnTemplate(article);
    }

    @RequestMapping(value = "/article/find-random-article",method = RequestMethod.GET)
    public Object findRandomArticle(){
        return new ReturnTemplate(articleService.findRandomArticle(1));
    }

    @RequestMapping(value = "/article/vote",method = RequestMethod.POST)
    public Object vote(final @PathParam("vote") String vote,final @PathParam("id") String id){

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
     * 查找某个 tag 下的 article （分页）
     */
    @RequestMapping(value = {"/tag/{tagId}/article"},method = RequestMethod.GET)
    public Object findAllArticlesByTagId(final @PathVariable("tagId") String tagId,
                                         final @RequestParam(value="page",required=false,defaultValue="1") int page,
                                         final @RequestParam(value="size",required=false,defaultValue="10") int size){

        log.debug("tagId = {}. page = {}. size = {}.",tagId,page,size);

        if(!isTagIdValid(tagId)){
            log.error("tagId = {}.",tagId);
            throw new IllegalArgumentException("tagId is invalid");
        }

        if(!ValidUtil.validPageAndSize(page,size)){
            log.error("page = {}.size = {}.",tagId);
            throw new IllegalArgumentException("tagId is invalid");
        }

        return new ReturnTemplate(articleService.findByTagIdAndInPage(new PageHandler(size,page),tagId).getContent());
    }

    private boolean isTagIdValid(final String tagId) {
        if(StringUtils.isEmpty(tagId)){
            return false;
        }
        return tagService.findById(tagId) != null;
    }

    /**
     * 获得首页文章数据
     */
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
}
