package com.allenway.visitor.controller;

import com.allenway.visitor.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by wuhuachuan on 16/5/31.
 */

@RestController
public class UserController {

    @Autowired
    private UserService userService;
}
