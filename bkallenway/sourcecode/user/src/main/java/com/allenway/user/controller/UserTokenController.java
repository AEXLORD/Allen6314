package com.allenway.user.controller;

import com.allenway.infrustructure.exception.UserLogoutException;
import com.allenway.user.entity.UserToken;
import com.allenway.user.service.UserService;
import com.allenway.user.service.UserTokenService;
import com.allenway.utils.response.ReturnTemplate;
import com.allenway.utils.validparam.ValidUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by wuhuachuan on 16/6/29.
 */

@RestController
@Slf4j
public class UserTokenController {

    @Autowired
    private UserTokenService userTokenService;

    @Autowired
    private UserService userService;

    @RequestMapping(value = "/user/find-user-by-token",method = RequestMethod.GET)
    public Object findUserByToken(String token){

        if(ValidUtils.validIdParam(token)){
            UserToken userToken = userTokenService.findUserTokenByToken(token);

            ReturnTemplate returnTemplate = new ReturnTemplate();

            returnTemplate.addData("user",userService.finduserById(userToken.getUserId()));
            return returnTemplate;
        } else {
            throw new IllegalArgumentException("token is invalid");
        }
    }

    @RequestMapping(value = "/user/logout",method = RequestMethod.GET)
    public Object userLogout(String id){
        if(ValidUtils.validIdParam(id)){
            UserToken userToken = userTokenService.findUserTokenByUserId(id);
            if(userToken == null){
                throw new UserLogoutException("user has logout");
            } else {
                userTokenService.delete(userToken);
                return new ReturnTemplate();
            }
        } else {
            throw new IllegalArgumentException("id is invalid");
        }
    }
}
