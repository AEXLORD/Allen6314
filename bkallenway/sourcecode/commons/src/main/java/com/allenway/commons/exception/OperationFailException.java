package com.allenway.commons.exception;

import lombok.NoArgsConstructor;

/**
 * Created by wuhuachuan on 16/3/29.
 */

@NoArgsConstructor
public class OperationFailException extends RuntimeException{
    public OperationFailException(final String message){
        super(message);
    }
}
