package com.allenway.visitor.dao;

import com.allenway.visitor.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Created by wuhuachuan on 16/5/31.
 */
public interface UserDao extends JpaRepository<User,String>{
}
