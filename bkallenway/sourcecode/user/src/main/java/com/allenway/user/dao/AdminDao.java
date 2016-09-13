package com.allenway.user.dao;

import com.allenway.user.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Created by wuhuachuan on 16/3/3.
 */

public interface AdminDao extends JpaRepository<Admin, String> {
    Admin findByUsername(String username);
}
