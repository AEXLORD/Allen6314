package com.allenway.user.service;

import com.allenway.user.entity.User;

/**
 * Created by wuhuachuan on 16/5/31.
 */
public interface UserService {
    void save(User user);

    User findUserByUsername(String username);
}
