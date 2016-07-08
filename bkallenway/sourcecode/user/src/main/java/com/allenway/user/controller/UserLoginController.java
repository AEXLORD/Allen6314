package com.allenway.user.controller;

import com.allenway.commons.token.GetTokenUtils;
import com.allenway.commons.token.TokenEntity;
import com.allenway.infrustructure.exception.DataNotFoundException;
import com.allenway.user.entity.User;
import com.allenway.user.entity.UserToken;
import com.allenway.user.service.UserService;
import com.allenway.user.service.UserTokenService;
import com.allenway.utils.encryption.DESEncryptUtil;
import com.allenway.utils.response.ReturnStatusCode;
import com.allenway.utils.response.ReturnTemplate;
import com.allenway.utils.validparam.ValidUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.HashMap;

/**
 * Created by wuhuachuan on 16/6/27.
 */

@RestController(value = "user_login")
@Slf4j
//@ConditionalOnExpression("${config.oauth2.switch}")
public class UserLoginController {

    @Autowired
    private UserService userService;

    @Autowired
    private GetTokenUtils getTokenUtils;

    @Autowired
    private UserTokenService userTokenService;

    @Value("${config.oauth2.switch}")
    private String oauthSwitch;

    @Value("${config.oauth2.expired_in}")
    private String expired_in;

    @RequestMapping(value = {"/user/login"},method = RequestMethod.POST)
    public Object register(User user) throws IOException {

        log.info("/user/login ... username = {}. password = {}.",user.getUsername(),user.getPassword());

        if(ValidUtils.validIdParam(user.getUsername()) || ValidUtils.validIdParam(user.getPassword())){

            User user1 = userService.findUserByUsername(user.getUsername());

            ReturnTemplate returnTemplate = new ReturnTemplate();
            if(user1 == null){
                returnTemplate.setStatusCode(ReturnStatusCode.USERNAME_PASSWORD_WRONG);
                return returnTemplate;
            } else if(DESEncryptUtil.matchPassphrase(user1.getPassword(),user1.getSalt(),user.getPassword())){
                returnTemplate.setStatusCode(ReturnStatusCode.USERNAME_PASSWORD_WRONG);
                return returnTemplate;
            } else {
                returnTemplate.addData("user",decorate(user1));

                TokenEntity tokenEntity;
                if("true".equals(oauthSwitch)){
                    tokenEntity = getTokenUtils.getToken(user1.getId());
                } else {
                    tokenEntity = new TokenEntity.Builder()
                                                        .access_token(user1.getId())
                                                        .expires_in(expired_in)
                                                        .refresh_token(null)
                                                        .token_type("Bearer")
                                                        .build();
                }
                userTokenService.save(new UserToken(user1.getId(),tokenEntity.getAccess_token()));
                returnTemplate.addData("token",tokenEntity);
                return returnTemplate;
            }
        } else {
            throw new IllegalArgumentException("username or password is invalid!");
        }
    }

    private HashMap<String, String> decorate(User user) {
        HashMap<String,String> hashMap = new HashMap<String,String>();

        hashMap.put("username",user.getUsername());
        hashMap.put("email",user.getEmail());
        hashMap.put("phone",user.getPhone());

        return hashMap;
    }
}
