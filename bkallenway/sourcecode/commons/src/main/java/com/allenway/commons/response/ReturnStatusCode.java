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
    USERNAME_PASSWORD_WRONG(2001), //登录的用户名密码错误
    USER_HAS_LOGOUT(2002), //用户已经登出
    OPERATION_FAIL(2003);  //该issue还有item,无法删除

    private int code;

    ReturnStatusCode(final int code){this.code = code;}

    public int getCode(){
        return this.code;
    }
}
