package com.allenway.visitor.service;

import com.allenway.visitor.entity.Module;

import java.util.List;

/**
 * Created by wuhuachuan on 16/5/30.
 */
public interface ModuleService {

    public Module addModule(Module module);
    public List<Module> findAllModules();
}
