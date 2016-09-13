package com.allenway.visitor.controller;

import Boot.MyTestBoot;
import com.allenway.commons.exception.DataNotFoundException;
import com.allenway.commons.page.PageHandler;
import com.allenway.commons.response.ReturnTemplate;
import com.allenway.visitor.model.Article;
import com.allenway.visitor.model.Module;
import com.allenway.visitor.model.Tag;
import com.allenway.visitor.service.ArticleService;
import com.allenway.visitor.service.ModuleService;
import com.allenway.visitor.service.TagService;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.data.domain.Page;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.util.StringUtils;

import java.util.Iterator;
import java.util.UUID;

import static org.junit.Assert.*;

/**
 * Created by wuhuachuan on 16/9/11.
 */

@Slf4j
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = MyTestBoot.class)
@WebAppConfiguration
public class ArticleControllerTest {

    @Autowired
    private ArticleController articleController;

    @Autowired
    private ModuleService moduleService;

    @Autowired
    private TagService tagService;

    @Autowired
    private ArticleService articleService;

    /**
     * 测试保存文章
     */
    @Test
    public void saveArticle() {
        //测试为article 为null
        try {
            articleController.saveArticle(null);
            assertFalse(true);
        } catch (IllegalArgumentException e){
            assertTrue(true);
        }

        //测试 title 没有
        Article article = new Article();
        article.setContent(UUID.randomUUID().toString());
        article.setTagId(UUID.randomUUID().toString());
        try {
            articleController.saveArticle(article);
            assertTrue(false);
        } catch (IllegalArgumentException e){
            assertTrue(true);
        }

        //测试 tagId 错误
        Article article1 = new Article();
        article1.setTitle(UUID.randomUUID().toString());
        article1.setContent(UUID.randomUUID().toString());
        article1.setTagId(UUID.randomUUID().toString());
        try {
            articleController.saveArticle(article1);
            assertTrue(false);
        } catch (IllegalArgumentException e){
            assertTrue(true);
        }

        //测试正常 insert
        Module module = new Module("test-find-all-modules-" + UUID.randomUUID().toString());
        module = moduleService.saveAndFlush(module);
        Tag tag = new Tag("test-find-tags-by-module-"+UUID.randomUUID().toString(),module.getId());
        tag = tagService.saveAndFlush(tag);

        Article article2 = new Article();
        String title = UUID.randomUUID().toString();
        article2.setTitle(title);
        article2.setContent(UUID.randomUUID().toString());
        article2.setTagId(tag.getId());

        articleController.saveArticle(article2);

        Page<Article> articles = articleService.findByTagIdAndInPage(new PageHandler(10,1),tag.getId());

        boolean flag = false;

        Iterator<Article> iterator = articles.iterator();
        while(iterator.hasNext()){
            Article a = iterator.next();
            if(a.getTitle().equals(title)){
                flag = true;
                break;
            }
        }

        assertTrue(flag);
    }

    /**
     * 测试删除文章
     */
    @Test
    public void deleteArticleById() {
        //测试 id 为空
        try {
            articleController.deleteArticleById(null);
            assertFalse(true);
        }catch (IllegalArgumentException e){
            assertTrue(true);
        }

        //测试 id 不对
        try {
            articleController.deleteArticleById(UUID.randomUUID().toString());
            assertFalse(true);
        }catch (DataNotFoundException e){
            assertTrue(true);
        }

        //测试正常删除
        Module module = new Module("test-find-all-modules-" + UUID.randomUUID().toString());
        module = moduleService.saveAndFlush(module);
        Tag tag = new Tag("test-find-tags-by-module-"+UUID.randomUUID().toString(),module.getId());
        tag = tagService.saveAndFlush(tag);

        Article article = new Article();
        String title = UUID.randomUUID().toString();
        article.setTitle(title);
        article.setContent(UUID.randomUUID().toString());
        article.setTagId(tag.getId());

        articleController.saveArticle(article);

        Page<Article> articles = articleService.findByTagIdAndInPage(new PageHandler(10,1),tag.getId());

        String articleId = null;
        Iterator<Article> iterator = articles.iterator();
        while(iterator.hasNext()){
            Article a = iterator.next();
            if(a.getTitle().equals(title)){
                articleId = a.getId();
                break;
            }
        }

        if(StringUtils.isEmpty(articleId)){
            assertFalse(true);
        }

        articleController.deleteArticleById(articleId);

        assertTrue(articleService.findById(articleId).isDelete() == true);
    }

    /**
     * 测试根据 ID 查找文章
     */
    @Test
    public void findArticleById() {
        //测试 id 为空
        try {
            articleController.findArticleById(null);
            assertFalse(true);
        }catch (IllegalArgumentException e){
            assertTrue(true);
        }

        //测试 id 不对
        try {
            articleController.findArticleById(UUID.randomUUID().toString());
            assertFalse(true);
        }catch (DataNotFoundException e){
            assertTrue(true);
        }

        //测试正常查找
        Module module = new Module("test-find-all-modules-" + UUID.randomUUID().toString());
        module = moduleService.saveAndFlush(module);
        Tag tag = new Tag("test-find-tags-by-module-"+UUID.randomUUID().toString(),module.getId());
        tag = tagService.saveAndFlush(tag);

        Article article = new Article();
        String title = UUID.randomUUID().toString();
        article.setTitle(title);
        article.setContent(UUID.randomUUID().toString());
        article.setTagId(tag.getId());

        articleController.saveArticle(article);

        Page<Article> articles = articleService.findByTagIdAndInPage(new PageHandler(10,1),tag.getId());

        String articleId = null;
        Iterator<Article> iterator = articles.iterator();
        while(iterator.hasNext()){
            Article a = iterator.next();
            if(a.getTitle().equals(title)){
                articleId = a.getId();
                break;
            }
        }

        if(StringUtils.isEmpty(articleId)){
            assertFalse(true);
        }

        ReturnTemplate returnTemplate = (ReturnTemplate) articleController.findArticleById(articleId);

        assertNotNull(returnTemplate);
        assertNotNull(returnTemplate.getData());

        assertNotNull((Article) returnTemplate.getData());
    }

    /**
     * 测试随机查找一篇文章
     */
    @Test
    public void findRandomArticle() {
        ReturnTemplate returnTemplate = (ReturnTemplate) articleController.findRandomArticle();

        assertNotNull(returnTemplate);
        assertNotNull(returnTemplate.getData());

        assertNotNull(returnTemplate.getData());
    }

    /**
     * 测试 点赞 和踩的功能
     */
    @Test
    public void vote(){
        Module module = new Module("test-find-all-modules-" + UUID.randomUUID().toString());
        module = moduleService.saveAndFlush(module);
        Tag tag = new Tag("test-find-tags-by-module-"+UUID.randomUUID().toString(),module.getId());
        tag = tagService.saveAndFlush(tag);

        Article article = new Article();
        String title = UUID.randomUUID().toString();
        article.setTitle(title);
        article.setContent(UUID.randomUUID().toString());
        article.setTagId(tag.getId());

        articleController.saveArticle(article);

        Page<Article> articles = articleService.findByTagIdAndInPage(new PageHandler(10,1),tag.getId());

        Article article1 = null;
        Iterator<Article> iterator = articles.iterator();
        while(iterator.hasNext()){
            Article a = iterator.next();
            if(a.getTitle().equals(title)){
                article1 = a;
                break;
            }
        }

        //没有 vote 参数
        try{
            articleController.vote(null,article1.getId());
            assertFalse(true);
        } catch (IllegalArgumentException e){
            assertTrue(true);
        }

        // vote 参数不为 0 或者 1
        try{
            articleController.vote("2",article1.getId());
            assertFalse(true);
        } catch (IllegalArgumentException e){
            assertTrue(true);
        }

        //article 的 id 为错的
        try{
            articleController.vote("1",UUID.randomUUID().toString());
            assertFalse(true);
        } catch (DataNotFoundException e){
            assertTrue(true);
        }

        //正常投赞票
        int oldUp = article1.getUp();
        articleController.vote("1",article1.getId());
        article = articleService.findById(article1.getId());
        assertTrue(oldUp == (article.getUp() - 1));

        //正常投踩票
        int oldDown = article1.getDown();
        articleController.vote("0",article1.getId());
        article = articleService.findById(article1.getId());
        assertTrue(oldUp == (article.getDown() - 1));
    }
}