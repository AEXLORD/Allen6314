package com.allenway.user.kongoauth;

import com.allenway.utils.json.GsonUtil;
import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by wuhuachuan on 16/6/28.
 */

@Slf4j
//@Component
@Deprecated
public class GetTokenUtils {

    private GetTokenUtils(){}

    private Gson gson = GsonUtil.getInstance();

    @Value("${config.springoauth.oauthTokenApiURL}")
    private String oauthTokenApiURL;

    @Value("${config.springoauth.clientId}")
    private String clientId;

    @Value("${config.springoauth.clientSecret}")
    private String clientSecret;

    @Value("${config.springoauth.grantType}")
    private String grantType;

    @Value("${config.springoauth.provisionKey}")
    private String provisionKey;

    @Value("${config.springoauth.scope}")
    private String scope;

    /**
     * 拿到 kongoauth
     * @return
     */
    public TokenEntity getToken(final String userid) throws IOException {

        //去除证书验证（注意：生产环境下需要进行证书验证）
        SSLCertificateValidation.disable();

        HttpURLConnection connection;
        OAuthParamEntity oauthParamEntity = createOAuthParamEntity();
        connection = (HttpURLConnection) new URL(oauthParamEntity.getOauthTokenApiURL()).openConnection();
        sendConnectionParams(connection,userid);
        connection.connect();

        //获取返回值
        BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        String lines;
        String result = "";
        while ((lines = reader.readLine()) != null) {
            if(lines != null){
                result = result + lines;
            }
        }

        reader.close();
        connection.disconnect();

        return gson.fromJson(result, TokenEntity.class);
    }

    /**
     * 向OAuth 发送参数
     * @param connection
     * @throws IOException
     */
    private void sendConnectionParams(HttpURLConnection connection,String adminId) throws IOException {

        connection.setRequestMethod("POST");
        connection.setDoOutput(true);
        connection.setDoInput(true);
        OAuthParamEntity oauthParamEntity = createOAuthParamEntity();
        String param =
                "client_id="+ oauthParamEntity.getClientId() +"&"+
                        "client_secret="+ oauthParamEntity.getClientSecret() +"&"+
                        "grant_type="+ oauthParamEntity.getGrantType() +"&"+
                        "provision_key="+ oauthParamEntity.getProvisionKey() +"&"+
                        "authenticated_userid="+adminId +"&"+
                        "scope=" + oauthParamEntity.getScope();

        OutputStream targetOS = connection.getOutputStream();
        try {
            targetOS.write(param.getBytes());
            targetOS.flush();
        } finally {
            targetOS.close();
        }
    }

    private OAuthParamEntity createOAuthParamEntity(){
        log.info("create OAuthParamEntity ... oauthTokenApiURL = {},clientId = {}," +
                                    "clientSecret = {},grantType = {},provisionKey = {},scope = {}",
                                                                    oauthTokenApiURL,
                                                                    clientId,
                                                                    clientSecret,
                                                                    grantType,
                                                                    provisionKey,
                                                                    scope);
        return new OAuthParamEntity.Builder()
                                   .oauthTokenApiURL(oauthTokenApiURL)
                                   .clientId(clientId)
                                   .clientSecret(clientSecret)
                                   .grantType(grantType)
                                   .provisionKey(provisionKey)
                                   .scope(scope)
                                   .build();
    }

}
