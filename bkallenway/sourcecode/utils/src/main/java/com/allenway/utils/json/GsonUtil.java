package com.allenway.utils.json;

import com.google.gson.Gson;

/**
 * GsonUtil :
 *
 * @author wuhuachuan712@163.com
 * @date 16/8/14
 */
public class GsonUtil {

    private GsonUtil(){}

    private static Gson gson = new Gson();

    /**
     * 静态工厂方法返回单一实例的Gson对象
     * 避免重复创建 gson 对象
     * @return
     */
    public static Gson getInstance(){
        return gson;
    }
}
