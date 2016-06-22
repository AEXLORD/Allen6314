package com.allenway.visitor.support;

/**
 * Created by wuhuachuan on 16/6/20.
 */
public enum RecommendClassify {
    zhihu("zhihu");  // 知乎

    private String type;
    private RecommendClassify(String type){
        this.type = type;
    }

    public String getType(){
        return this.type;
    }
}
