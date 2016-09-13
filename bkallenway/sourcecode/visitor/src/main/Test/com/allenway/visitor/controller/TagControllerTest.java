package com.allenway.visitor.controller;

import Boot.MyTestBoot;
import com.allenway.visitor.model.Module;
import com.allenway.visitor.model.Tag;
import com.allenway.visitor.service.ModuleService;
import com.allenway.visitor.service.TagService;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import java.util.UUID;

import static org.junit.Assert.*;

/**
 * Created by wuhuachuan on 16/9/4.
 */

@Slf4j
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = MyTestBoot.class)
@WebAppConfiguration
public class TagControllerTest {

    @Autowired
    private TagController tagController;

    @Autowired
    private ModuleService moduleService;

    @Autowired
    private TagService tagService;

    /**
     * 测试新增 tag
     */
    @Test
    public void addTag() throws Exception {

        //测试没有名字
        try {
            Tag tag = new Tag();
            tagController.addTag(tag);
            assertFalse(true);
        } catch (IllegalArgumentException e){
            assertTrue(true);
        }

        //测试没有 moduleId
        try {
            Tag tag = new Tag("test-addTag-TagName-" + UUID.randomUUID().toString(),null);
            tagController.addTag(tag);
            assertFalse(true);
        } catch (IllegalArgumentException e){
            assertTrue(true);
        }

        //测试 moduleId 是错误的
        try {
            Tag tag = new Tag("test-addTag-TagName-" + UUID.randomUUID().toString(),UUID.randomUUID().toString());
            tagController.addTag(tag);
            assertFalse(true);
        } catch (IllegalArgumentException e){
            assertTrue(true);
        }

        //测试正常插入
        Module module = new Module("test-find-all-modules-" + UUID.randomUUID().toString());
        module = moduleService.saveAndFlush(module);

        Tag tag = new Tag("test-find-tags-by-module-"+UUID.randomUUID().toString(),module.getId());
        tagController.addTag(tag);

        assertNotNull(tagService.findByName(tag.getName()));
    }

    /**
     * 测试删除 tag
     */
    @Test
    public void deleteTagById() throws Exception {
        //测试 id 为空
        try {
            tagController.deleteTagById(null);
            assertFalse(true);
        } catch (IllegalArgumentException e){
            assertTrue(true);
        }

        //测试 id 为错误的id
        try {
            tagController.deleteTagById(UUID.randomUUID().toString());
            assertFalse(true);
        } catch (IllegalArgumentException e){
            assertTrue(true);
        }

        //测试正常删除
        Module module = new Module("test-find-all-modules-" + UUID.randomUUID().toString());
        module = moduleService.saveAndFlush(module);

        Tag tag = new Tag("test-find-tags-by-module-"+UUID.randomUUID().toString(),module.getId());
        tagController.addTag(tag);

        Tag t = tagService.findByName(tag.getName());
        assertNotNull(t);

        tagController.deleteTagById(t.getId());

        assertTrue(tagService.findByName(tag.getName()).isDelete() == true);
    }
}