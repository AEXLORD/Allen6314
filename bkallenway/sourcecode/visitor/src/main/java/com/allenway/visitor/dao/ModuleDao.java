package com.allenway.visitor.dao;

import com.allenway.visitor.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Created by wuhuachuan on 16/5/30.
 */
public interface ModuleDao extends JpaRepository<Module,String>{
    @Query("select module from Module module where isDelete='0' order by weight")
    List<Module> findAllModules();
}
