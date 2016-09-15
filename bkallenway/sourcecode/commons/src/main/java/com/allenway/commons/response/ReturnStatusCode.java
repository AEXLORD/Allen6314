package com.allenway.commons.response;

/**
 * Created by wuhuachuan on 16/3/3.
 */
public enum ReturnStatusCode {

    SUCCESS(0),  //代表成功的请求

    /**
     * 服务器端报错
     */
    RuntimeException(1000),
    DataNotFoundException(1001),
    IllegalArgumentException(1002),
    NullPointerException(1003),

    /**
     * 业务逻辑出错
     */
    //用户相关
    USERNAME_PASSWORD_WRONG(2001), //帐号密码错误
    USER_EXIST(2002),  //用户已经存在

    //其他
    OPERATION_FAIL(3001); //该操作不能执行

    private int code;

    ReturnStatusCode(final int code){this.code = code;}

    public int getCode(){
        return this.code;
    }
}
