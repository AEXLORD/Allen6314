package com.allenway.commons.constant;

/**
 * OAuthSwith :
 *
 * @author wuhuachuan712@163.com
 * @date 16/9/11
 */
public enum OAuthSwith {

    TRUE("true"),
    FALSE("false");

    private String key;

    OAuthSwith(final String key){
        this.key = key;
    }

    public String getKey(){
        return this.key;
    }
}
