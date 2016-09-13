package com.allenway.user.controller;

import com.allenway.commons.constant.OAuthSwith;
import com.allenway.commons.exception.DataNotFoundException;
import com.allenway.commons.response.ReturnStatusCode;
import com.allenway.commons.response.ReturnTemplate;
import com.allenway.user.entity.Admin;
import com.allenway.user.oauthtoken.GetTokenUtils;
import com.allenway.user.service.AdminService;
import com.allenway.utils.encryption.DESEncryptUtil;
import com.allenway.utils.validparam.ValidUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by wuhuachuan on 16/3/3.
 */

@Slf4j
@RestController
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Value("${config.oauth2.switch}")
    private String oauthSwitch;

    /**
     * 根据 ID 获得 admin 用户
     */
    @RequestMapping(value = {"/admin/{id}"},method = RequestMethod.GET)
    public Object findAdmin(final @PathVariable("id") String id){

        log.debug("id = {}",id);

        if(!ValidUtil.validIdParam(id)){
            log.error("id = {}.",id);
            throw new IllegalArgumentException("id is invalid. id ");
        }

        Admin admin = adminService.findById(id);

        if(admin == null){
            log.error("id = {}.",id);
            throw new DataNotFoundException("admin == null based on the id");
        }

        return new ReturnTemplate(decorate(admin));
    }

    @RequestMapping(value = "/login",method = RequestMethod.POST)
    public Object login(final Admin admin) throws IOException {

        log.debug("admin = {}.",admin);

        if(!validLoginAdminParam(admin)){
            log.error("admin = {}.",admin);
            throw new IllegalArgumentException("param is invalid");
        }

        Admin dbAdmin = adminService.findByUsername(admin.getUsername());

        if(dbAdmin == null || !DESEncryptUtil.matchPassphrase(dbAdmin.getPassword(),dbAdmin.getSalt(),admin.getPassword())){
            return new ReturnTemplate<>(ReturnStatusCode.USERNAME_PASSWORD_WRONG,"username and password is wrong");
        }

        String tokenValue = getOAuthToken(dbAdmin.getId());
        dbAdmin.setToken(tokenValue);
        adminService.save(dbAdmin);

        return new ReturnTemplate<>(decorateTokenAndAdmin(dbAdmin,tokenValue));
    }

    /**
     * 去除密码字段（即不返回密码字段给前端）
     */
    private Map<String,Object> decorate(final Admin admin) {
        Map<String,Object> map = new HashMap<>(2);

        map.put("id",admin.getId());
        map.put("username",admin.getUsername());

        return map;
    }

    /**
     * 登录操作的返回包装（包括 token 和去除密码的 admin）
     */
    private Map<String,Object> decorateTokenAndAdmin(final Admin dbAdmin,final String token) {
        Map<String,Object> map = new HashMap<>(2);

        map.put("admin",decorate(dbAdmin));
        map.put("token",token);

        return map;
    }

    /**
     * 验证登录的用户名,密码信息是否合理
     */
    private boolean validLoginAdminParam(Admin admin) {
        if(StringUtils.isEmpty(admin.getUsername()) || StringUtils.isEmpty(admin.getPassword())){
            return false;
        }
        //防止sql 注入攻击
        if(admin.getPassword().contains("\"") || admin.getPassword().contains("\'")){
            return false;
        }
        return true;
    }

    /**
     * 获取 token.
     * 如果 oauthSwith != on ,那么创建一个 临时的 token
     */
    private String getOAuthToken(final String adminId) throws IOException {
        if(OAuthSwith.ON.getKey().equals(oauthSwitch)){
            return GetTokenUtils.getToken(adminId).getAccess_token();
        } else {
            return "temp_access_token";
        }
    }
}
