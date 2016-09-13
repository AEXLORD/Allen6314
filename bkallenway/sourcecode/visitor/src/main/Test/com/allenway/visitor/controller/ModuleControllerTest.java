package com.allenway.visitor.controller;

import Boot.MyTestBoot;
import com.allenway.commons.exception.DataNotFoundException;
import com.allenway.commons.response.ReturnTemplate;
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

import java.util.List;
import java.util.UUID;

import static org.junit.Assert.*;

/**
 * Created by wuhuachuan on 16/9/3.
 */
@Slf4j
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = MyTestBoot.class)
@WebAppConfiguration
public class ModuleControllerTest {

    @Autowired
    private ModuleController moduleController;

    @Autowired
    private ModuleService moduleService;

    @Autowired
    private TagService tagService;

    /**
     * 测试查找所有的 module
     */
    @Test
    public void testFindAllModules() throws Exception {

        //初始化一个module
        Module module = new Module("test-find-all-modules-" + UUID.randomUUID().toString());
        moduleService.saveAndFlush(module);

        ReturnTemplate returnData = (ReturnTemplate) moduleController.findAllModules();

        assertNotNull(returnData);
        assertNotNull(returnData.getData());

        List<Module> modules = (List<Module>) returnData.getData();

        boolean flag = false;
        for (Module m : modules){
            if(m.getName().equals(module.getName())){
                flag = true;
                break;
            }
        }

        assertTrue(flag);
    }

    /**
     * 测试查找某个 module下的所有 tag
     */
    @Test
    public void testFindTagsByModuleName(){

        //测试 moduleId 为空
        try {
            moduleController.findTagsByModuleName(null);
            assertFalse(true);
        } catch (IllegalArgumentException e){
            assertTrue(true);
        }

        //测试 moduleId 为错误
        try {
            moduleController.findTagsByModuleName(UUID.randomUUID().toString());
            assertFalse(true);
        } catch (DataNotFoundException e){
            assertTrue(true);
        }

        //初始化一个module 以及该module 下的一个tag
        String moduleName = "test-find-all-modules-" + UUID.randomUUID().toString();
        Module module = new Module(moduleName);
        module = moduleService.saveAndFlush(module);

        Tag tag = new Tag("test-find-tags-by-module-"+UUID.randomUUID().toString(),module.getId());
        tagService.saveAndFlush(tag);

        //测试正常查找
        ReturnTemplate returnTemplate = (ReturnTemplate) moduleController.findTagsByModuleName(moduleName);
        assertNotNull(returnTemplate);
        assertNotNull(returnTemplate.getData());

        List<Tag> tags = (List<Tag>) returnTemplate.getData();

        boolean flag = false;
        for (Tag t : tags){
            if(t.getName().equals(tag.getName())){
                flag = true;
                break;
            }
        }

        assertTrue(flag);
    }

    /**
     * 测试新增 module
     */
    @Test
    public void testAddModule(){

        //测试没有moduleName
        try {
            Module wrongModule = new Module();
            moduleController.addModule(wrongModule);
            assertFalse(true);
        } catch (IllegalArgumentException e){
            assertTrue(true);
        }

        //测试正常新增
        Module module = new Module("test-add-module-" + UUID.randomUUID().toString());

        moduleController.addModule(module);

        assertNotNull(moduleService.findByName(module.getName()));
    }
}