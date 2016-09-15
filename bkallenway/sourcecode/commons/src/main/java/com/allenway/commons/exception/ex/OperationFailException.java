package com.allenway.commons.exception.ex;

/**
 * OperationFailException :
 *
 * @author wuhuachuan712@163.com
 * @date 16/9/15
 */
public class OperationFailException extends RuntimeException{
    public OperationFailException(final String message){
        super(message);
    }
}
