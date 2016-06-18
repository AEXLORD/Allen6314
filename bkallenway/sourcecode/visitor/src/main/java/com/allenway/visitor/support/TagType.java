package com.allenway.visitor.support;

/**
 * Created by wuhuachuan on 16/6/18.
 */
public enum TagType {
    BASE("base"),  // 基础
    FRAME("frame"),   //框架
    OTHER("other");   //其他

    private String type;
    private TagType(String type){
        this.type = type;
    }

    public String getType(){
        return this.type;
    }
}
