package com.allenway.user.service;

import com.allenway.user.entity.UserToken;

/**
 * Created by wuhuachuan on 16/6/29.
 */
public interface UserTokenService {
    void save(UserToken userToken);

    UserToken findUserTokenByToken(String token);
    UserToken findUserTokenByUserId(String userId);

    void delete(UserToken userToken);
}
