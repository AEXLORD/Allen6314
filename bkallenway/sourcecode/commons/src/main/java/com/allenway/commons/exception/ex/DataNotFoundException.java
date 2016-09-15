package com.allenway.commons.exception.ex;

import lombok.NoArgsConstructor;

/**
 * Created by wuhuachuan on 16/3/29.
 */

@NoArgsConstructor
public class DataNotFoundException extends RuntimeException{
    public DataNotFoundException(final String message){
        super(message);
    }
}
