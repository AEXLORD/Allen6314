package com.allenway.visitor.service;

import com.allenway.visitor.entity.Module;

import java.util.Set;

/**
 * Created by wuhuachuan on 16/5/30.
 */
public interface ModuleService {

    public Module save(Module module);
    public Set<Module> findAllModules();

    Module findModuleById(String moduleid);

}
