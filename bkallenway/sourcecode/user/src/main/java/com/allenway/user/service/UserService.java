package com.allenway.user.service;

import com.allenway.user.entity.User;

/**
 * UserService :
 *
 * @author wuhuachuan712@163.com
 * @date 16/9/15
 */
public interface UserService {

    void save(final User user);

    User findById(final String id);
    User findByUsername(final String username);

}
