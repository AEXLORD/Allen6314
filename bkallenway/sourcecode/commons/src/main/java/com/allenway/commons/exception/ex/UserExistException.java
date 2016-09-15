package com.allenway.commons.exception.ex;

/**
 * UserExistException :
 *
 * @author wuhuachuan712@163.com
 * @date 16/9/15
 */
public class UserExistException extends RuntimeException {
    public UserExistException(final String message){
        super(message);
    }
}
