package com.allenway.infrustructure.dao;

import com.allenway.infrustructure.entity.AdminToken;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Created by wuhuachuan on 16/7/11.
 */
public interface AdminTokenDao extends JpaRepository<AdminToken,String> {
}
