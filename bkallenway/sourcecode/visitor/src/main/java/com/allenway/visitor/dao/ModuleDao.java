package com.allenway.visitor.dao;

import com.allenway.visitor.entity.Module;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Set;

/**
 * Created by wuhuachuan on 16/5/30.
 */
public interface ModuleDao extends JpaRepository<Module,String>{

    @Cacheable(value = "modules",keyGenerator = "all_module")
    @Query("select module from Module module where isDelete='0' order by weight")
    Set<Module> findAllModules();
}
