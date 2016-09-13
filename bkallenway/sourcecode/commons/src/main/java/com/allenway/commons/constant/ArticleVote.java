package com.allenway.commons.constant;

/**
 * ArticleVote :
 *
 * @author wuhuachuan712@163.com
 * @date 16/9/11
 */
public enum ArticleVote {

    UP("1"),
    DOWN("0");

    private String key;

    ArticleVote(final String key){
        this.key = key;
    }

    public String getKey(){
        return this.key;
    }

}
