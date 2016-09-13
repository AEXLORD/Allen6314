package com.allenway.user.controller;

import Boot.MyTestBoot;
import com.allenway.commons.exception.DataNotFoundException;
import com.allenway.commons.response.ReturnTemplate;
import com.allenway.user.entity.Admin;
import com.allenway.user.service.AdminService;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import java.util.Map;
import java.util.UUID;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

/**
 * Created by wuhuachuan on 16/9/11.
 */

@Slf4j
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = MyTestBoot.class)
@WebAppConfiguration
public class AdminControllerTest {

    @Autowired
    private AdminController adminController;

    @Autowired
    private AdminService adminService;

    @Test
    public void findAdmin() {

        Admin initAdmin = new Admin();
        initAdmin.setUsername("test-findAdmin-"+ UUID.randomUUID().toString());
        adminService.saveAndFlush(initAdmin);

        String wrongId1 = "";
        String wrongId2 = UUID.randomUUID().toString();
        String correctId = initAdmin.getId();

        try {
            adminController.findAdmin(wrongId1);
            assertFalse(true);
        } catch (IllegalArgumentException e){
            assertTrue(true);
        }

        try {
            adminController.findAdmin(wrongId2);
            assertFalse(true);
        } catch (DataNotFoundException e){
            assertTrue(true);
        }

        ReturnTemplate returnTemplate = (ReturnTemplate) adminController.findAdmin(correctId);
        Map<String,Object> map = (Map<String, Object>) returnTemplate.getData();
        assertTrue(initAdmin.getUsername().equals(map.get("username")));
    }
}