package com.allenway.visitor.service;

import com.allenway.visitor.entity.Module;

import java.util.List;

/**
 * Created by wuhuachuan on 16/5/30.
 */
public interface ModuleService {

    void save(final Module module);
    Module saveAndFlush(Module module);

    Module findById(final String moduleId);
    Module findByName(String name);

    List<Module> findAllModules();
}
