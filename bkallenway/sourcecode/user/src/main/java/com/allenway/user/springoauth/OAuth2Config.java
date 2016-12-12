package com.allenway.user.springoauth;

import com.allenway.user.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.CompositeTokenGranter;
import org.springframework.security.oauth2.provider.TokenGranter;
import org.springframework.security.oauth2.provider.client.JdbcClientDetailsService;
import org.springframework.security.oauth2.provider.password.ResourceOwnerPasswordTokenGranter;
import org.springframework.security.oauth2.provider.token.AuthorizationServerTokenServices;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;
import org.springframework.security.oauth2.provider.token.store.JdbcTokenStore;

import javax.sql.DataSource;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by wuhuachuan on 16/5/12.
 */

@Configuration
@EnableAuthorizationServer
@EnableResourceServer
@ConditionalOnExpression("${config.oauth2.enable}")
public class OAuth2Config extends AuthorizationServerConfigurerAdapter {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private MyPasswordManager myPasswordManager;

    @Autowired
    private JdbcTokenStore jdbcTokenStore;

    @Autowired
    private AdminService adminService;

    @Bean
    public JdbcTokenStore jdbcTokenStore(){
        return new JdbcTokenStore(dataSource);
    }

    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints)
            throws Exception {
        endpoints.tokenStore(jdbcTokenStore);
        endpoints.authenticationManager(myPasswordManager);

        List<TokenGranter> tokenGranterList = new ArrayList<>(1);

        TokenGranter resourceOwnerPasswordTokenGranter = new ResourceOwnerPasswordTokenGranter(
                                                                    myPasswordManager,
                                                                    endpoints.getTokenServices(),
                                                                    endpoints.getClientDetailsService(),
                                                                    endpoints.getOAuth2RequestFactory());
        tokenGranterList.add(resourceOwnerPasswordTokenGranter);

        CompositeTokenGranter compositeTokenGranter = new CompositeTokenGranter(tokenGranterList);
        endpoints.tokenGranter(compositeTokenGranter);
    }

    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        clients.withClientDetails(new JdbcClientDetailsService(dataSource));
    }

    @Bean
    @Primary
    public AuthorizationServerTokenServices tokenServices() {
        DefaultTokenServices tokenServices = new DefaultTokenServices();
        tokenServices.setTokenStore(jdbcTokenStore);
        return tokenServices;
    }
}
