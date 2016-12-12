package com.allenway.user.kongoauth;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * Created by wuhuachuan on 16/5/3.
 */

@ToString
@Data
@NoArgsConstructor
@Deprecated
public class TokenEntity {
    private String access_token;
    private String expires_in;
    private String refresh_token;
    private String token_type;

    public TokenEntity(Builder builder){
        this.access_token = builder.access_token;
        this.expires_in = builder.expires_in;
        this.refresh_token = builder.refresh_token;
        this.token_type = builder.token_type;
    }

    /**
     * Builder 模式
     */
    public static class Builder{
        private String access_token;
        private String expires_in;
        private String refresh_token;
        private String token_type;

        public Builder access_token(String access_token){
            this.access_token = access_token;
            return this;
        }
        public Builder expires_in(String expires_in){
            this.expires_in = expires_in;
            return this;
        }
        public Builder refresh_token(String refresh_token){
            this.refresh_token = refresh_token;
            return this;
        }
        public Builder token_type(String token_type){
            this.token_type = token_type;
            return this;
        }

        public TokenEntity build(){
            return new TokenEntity(this);
        }
    }
}
