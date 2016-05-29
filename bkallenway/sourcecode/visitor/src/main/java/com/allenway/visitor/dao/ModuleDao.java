package com.allenway.visitor.dao;

import com.allenway.visitor.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Created by wuhuachuan on 16/5/30.
 */
public interface ModuleDao extends JpaRepository<Module,String>{
}
