package com.allenway.commons.response;

import lombok.Data;

/**
 * Created by wuhuachuan on 16/3/3.
 */

@Data
public class ReturnTemplate<T> {

    private int statusCode;  //状态信息
    private String errorMsg;   // 错误信息
    private T data; // 返回数据

    public ReturnTemplate(){
        this(ReturnStatusCode.SUCCESS.getCode(),null,null);
    }

    public ReturnTemplate(final T data){
        this(ReturnStatusCode.SUCCESS.getCode(),null,data);
    }

    public ReturnTemplate(final ReturnStatusCode statusCode,final String errorMsg){
        this(statusCode.getCode(),errorMsg,null);
    }

    public ReturnTemplate(final int statusCode,final String errorMsg,final T data){
        this.statusCode = statusCode;
        this.errorMsg = errorMsg;
        this.data = data;
    }
}

