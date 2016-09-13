package com.allenway.commons.exception;

import lombok.NoArgsConstructor;

/**
 * Created by wuhuachuan on 16/6/29.
 */
@NoArgsConstructor
public class UserLogoutException extends RuntimeException {
    public UserLogoutException(final String message){
        super(message);
    }
}
