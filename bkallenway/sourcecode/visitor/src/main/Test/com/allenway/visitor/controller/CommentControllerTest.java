package com.allenway.visitor.controller;

import Boot.MyTestBoot;
import com.allenway.commons.exception.ex.UsernamePasswordWrongException;
import com.allenway.user.service.UserService;
import com.allenway.visitor.entity.Article;
import com.allenway.visitor.entity.Comment;
import com.allenway.visitor.entity.Module;
import com.allenway.visitor.entity.Tag;
import com.allenway.visitor.service.ArticleService;
import com.allenway.visitor.service.CommentService;
import com.allenway.visitor.service.ModuleService;
import com.allenway.visitor.service.TagService;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import java.util.List;
import java.util.UUID;

import static org.junit.Assert.*;

/**
 * Created by wuhuachuan on 16/9/15.
 */

@Slf4j
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = MyTestBoot.class)
@WebAppConfiguration
public class CommentControllerTest {

    @Autowired
    private CommentController commentController;

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserService userService;

    @Autowired
    private ArticleService articleService;

    @Autowired
    private ModuleService moduleService;

    @Autowired
    private TagService tagService;

    @Test
    public void save() throws Exception {

        //初始化一篇文章
        Module module = new Module("test-find-all-modules-" + UUID.randomUUID().toString());
        module = moduleService.saveAndFlush(module);
        Tag tag = new Tag("test-find-tags-by-module-"+UUID.randomUUID().toString(),module.getId());
        tag = tagService.saveAndFlush(tag);
        Article article = articleService.saveAndFlush(new Article("test-comment-save-title-" + UUID.randomUUID().toString(),
                                                                  "test-comment-save-content-" + UUID.randomUUID().toString(),
                                                                    tag.getId()));
        //新增 coment 无 username;
        try {
            commentController.save(new Comment(null,
                                               article.getId(),
                                               "test-comment-" + UUID.randomUUID().toString()),
                                   "123456");
            assertFalse(true);
        } catch (IllegalArgumentException e){
            assertTrue(true);
        }

        //新增 coment 无 password;
        try {
            commentController.save(new Comment("test-comment-save-title-" + UUID.randomUUID().toString().substring(0,10),
                                                article.getId(),
                                                "test-comment-" + UUID.randomUUID().toString()),
                                   null);
            assertFalse(true);
        } catch (IllegalArgumentException e){
            assertTrue(true);
        }

        //新增 coment 无 评论内容;
        try {
            commentController.save(new Comment("test-user-" + UUID.randomUUID().toString().substring(0,10),
                                               article.getId(),
                                               null),
                                   "123456");
            assertFalse(true);
        } catch (IllegalArgumentException e){
            assertTrue(true);
        }

        //新增 coment 无 articleId;
        try {
            commentController.save(new Comment("test-user-" + UUID.randomUUID().toString().substring(0,10),
                                               null,
                                               "test-comment-" + UUID.randomUUID().toString()),
                                   "123456");
            assertFalse(true);
        } catch (IllegalArgumentException e){
            assertTrue(true);
        }

        //新增 coment 的 articleId 为错误的;
        try {
            commentController.save(new Comment("test-user-" + UUID.randomUUID().toString().substring(0,10),
                                               "test-articleId-" + UUID.randomUUID().toString(),
                                               "test-comment-" + UUID.randomUUID().toString()),
                                   "123456");
            assertFalse(true);
        } catch (IllegalArgumentException e){
            assertTrue(true);
        }

        //新增 coment 的 password 不是 6位;
        try {
            commentController.save(new Comment("test-user-" + UUID.randomUUID().toString().substring(0,10),
                                               article.getId(),
                                               "test-comment-" + UUID.randomUUID().toString()),
                                   "1234567");
            assertFalse(true);
        } catch (IllegalArgumentException e){
            assertTrue(true);
        }

        //测试正常添加一条 comment
        String username = "test-user-"+ UUID.randomUUID().toString().substring(0,10);
        String content = "test-comment-"+ UUID.randomUUID().toString();
        commentController.save(new Comment(username,
                                           article.getId(),
                                           content),
                               "123456");

        assertNotNull(userService.findByUsername(username));

        boolean flag = false;
        List<Comment> commentList = commentService.findByUsername(username);
        for(Comment comment: commentList){
            if(comment.getContent().equals(content)){
                flag = true;
                return;
            }
        }
        assertTrue(flag);

        //测试重复添加一条,还是用这个用户名,但是密码错误
        try {
            commentController.save(new Comment(username,
                                               article.getId(),
                                               "test-comment-" + UUID.randomUUID().toString()),
                                   "111111");
            assertFalse(true);
        } catch (UsernamePasswordWrongException e){
            assertTrue(true);
        }

        //测试重复添加一条,还是用这个用户名,密码正确,可以正常添加
        String content1 = "test-comment-"+ UUID.randomUUID().toString();
        commentController.save(new Comment(username,
                                           article.getId(),
                                           content1),
                               "123456");

        boolean flag1 = false;
        List<Comment> commentList1 = commentService.findByUsername(username);
        for(Comment comment: commentList1){
            if(comment.getContent().equals(content1)){
                flag1 = true;
                return;
            }
        }
        assertTrue(flag1);
    }
}