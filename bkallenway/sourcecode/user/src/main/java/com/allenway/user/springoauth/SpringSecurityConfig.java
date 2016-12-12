package com.allenway.user.springoauth;

import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

/**
 * Created by wuhuachuan on 16/5/16.
 */

@Configuration
@EnableWebSecurity
//@ConditionalOnExpression("${config.oauth2.enable}")
public class SpringSecurityConfig extends WebSecurityConfigurerAdapter {

    public SpringSecurityConfig() {
        super(true);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
//        web.ignoring().anyRequest();
        web.ignoring()
                .regexMatchers("/module/[\\s\\S]*")
                .regexMatchers("/article/[\\s\\S]*")
                .regexMatchers("/tag/[\\s\\S]*")
                .regexMatchers("/comment/[\\s\\S]*")
                .regexMatchers("/message/[\\s\\S]*")
                .regexMatchers("/module/[\\s\\S]*")
                .antMatchers("/oauth/token");
    }
}
