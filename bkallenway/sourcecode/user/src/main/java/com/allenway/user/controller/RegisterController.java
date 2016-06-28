package com.allenway.user.controller;

import com.allenway.user.entity.User;
import com.allenway.user.service.UserService;
import com.allenway.utils.encryption.DESEncryptUtil;
import com.allenway.utils.response.ReturnTemplate;
import com.allenway.utils.validparam.ValidUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

/**
 * Created by wuhuachuan on 16/6/27.
 */
@RestController
@Slf4j
public class RegisterController {

    @Autowired
    private UserService userService;

    @RequestMapping(value = {"/user/register"},method = RequestMethod.POST)
    public Object register(User user){

        log.info("/user/register ... username = {}. password = {}.",user.getUsername(),user.getPassword());

        if(ValidUtils.validIdParam(user.getUsername()) || ValidUtils.validIdParam(user.getPassword())){
            String salt = UUID.randomUUID().toString();
            String passPhrase = DESEncryptUtil.getPassphrase(DESEncryptUtil.getSalt(salt),user.getPassword());
            user.setSalt(salt);
            user.setPassword(passPhrase);
            userService.save(user);
            return new ReturnTemplate();
        } else {
            throw new IllegalArgumentException("username or password is invalid!");
        }
    }
}
