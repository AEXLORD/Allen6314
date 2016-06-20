package com.allenway.visitor.support;

/**
 * Created by wuhuachuan on 16/6/18.
 */
public enum TagType {

    /**
     *   针对 module 是 Learning
     */
    BASE("base"),  // 基础
    FRAME("frame"),   //框架
    OTHER("other"),   //其他

    /**
     *   针对 module 是 推荐
     */
    ZHIHU("zhihu");   //知乎

    private String type;
    private TagType(String type){
        this.type = type;
    }

    public String getType(){
        return this.type;
    }
}
