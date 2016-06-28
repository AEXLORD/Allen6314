package com.allenway.user.dao;

import com.allenway.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Created by wuhuachuan on 16/6/27.
 */
public interface UserDao extends JpaRepository<User,String> {

    User findUserByUsernameAndIsDelete(String username,String isDelete);
}
