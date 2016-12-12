package com.allenway.user.springoauth;

import com.allenway.user.entity.Admin;
import com.allenway.user.service.AdminService;
import com.allenway.utils.encryption.DESEncryptUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.ArrayList;

/**
 * Created by wuhuachuan on 16/5/16.
 */

@Slf4j
@Component(value = "myPasswordManager")
@ConditionalOnExpression("${config.oauth2.enable}")
public class MyPasswordManager implements AuthenticationManager{

    public MyPasswordManager(){
        System.out.println("MyPasswordManager create");
    }

    @Autowired
    private AdminService adminService;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        String username = (String) authentication.getPrincipal();
        String password = (String) authentication.getCredentials();

        if(StringUtils.isEmpty(username) || StringUtils.isEmpty(password)){
            throw new UsernameNotFoundException("username or password is null");
        }

        Admin dbAdmin = adminService.findByUsername(username);

        if(dbAdmin == null || !DESEncryptUtil.matchPassphrase(dbAdmin.getPassword(),dbAdmin.getSalt(),password)){
            throw new BadCredentialsException("username or password is wrong");
        }


        ArrayList<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("test"));

        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(username,password,authorities);

        return usernamePasswordAuthenticationToken;
    }
}
