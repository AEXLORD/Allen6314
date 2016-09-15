package com.allenway.user.dao;

import com.allenway.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * UserDao :
 *
 * @author wuhuachuan712@163.com
 * @date 16/9/15
 */
public interface UserDao extends JpaRepository<User, String> {
    User findByUsername(final String username);
}
