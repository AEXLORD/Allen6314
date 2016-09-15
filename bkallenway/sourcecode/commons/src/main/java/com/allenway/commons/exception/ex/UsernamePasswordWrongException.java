package com.allenway.commons.exception.ex;

/**
 * UsernamePasswordWrongException :
 *
 * @author wuhuachuan712@163.com
 * @date 16/9/15
 */
public class UsernamePasswordWrongException extends RuntimeException {
    public UsernamePasswordWrongException(final String message){
        super(message);
    }
}
