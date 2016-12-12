package com.allenway.user.springoauth;

import com.allenway.commons.response.ReturnTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.naming.OperationNotSupportedException;
import javax.servlet.http.HttpServletRequest;

/**
 * Created by wuhuachuan on 16/5/23.
 */

@RestController
@ConditionalOnExpression("${config.oauth2.enable}")
public class OAuth2Controller {

    @Autowired
    private TokenStore tokenStore;

    /**
     * 登出 删除 token
     */
    @RequestMapping(value = "/api/v1/uam/logout", method = RequestMethod.POST)
    public Object logout(HttpServletRequest request) throws OperationNotSupportedException {

        tokenStore.removeAccessToken(
                tokenStore.readAccessToken(
                        request.getHeader("Authorization").replace("Bearer", "").trim()));

        return new ReturnTemplate();
    }
}
