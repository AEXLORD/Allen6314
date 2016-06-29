package com.allenway.user.dao;

import com.allenway.user.entity.UserToken;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Created by wuhuachuan on 16/6/29.
 */
public interface UserTokenDao extends JpaRepository<UserToken,String> {
    UserToken findUserTokenByUserId(String userId);

    UserToken findUserTokenByToken(String token);
}
