package com.allenway.infrustructure.exception;

/**
 * Created by wuhuachuan on 16/6/29.
 */
public class UserLogoutException extends RuntimeException {
    public UserLogoutException(){}
    public UserLogoutException(String message){
        super(message);
    }
}
