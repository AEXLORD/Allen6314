package com.allenway.visitor.controller;

import com.allenway.commons.exception.DataNotFoundException;
import com.allenway.commons.response.ReturnTemplate;
import com.allenway.visitor.entity.Module;
import com.allenway.visitor.service.ModuleService;
import com.allenway.visitor.service.TagService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by wuhuachuan on 16/5/30.
 */

@Slf4j
@RestController
public class ModuleController {

    @Autowired
    private ModuleService moduleService;

    @Autowired
    private TagService tagService;

    @RequestMapping(value = {"/module"},method = RequestMethod.GET)
    public Object findAllModules(){
        return new ReturnTemplate(moduleService.findAllModules());
    }

    /**
     * 查找 某个 module 下的 所有 tag
     * @param moduleName
     * @return
     */
    @RequestMapping(value = {"/module/{moduleName}/tag"},method = RequestMethod.GET)
    public Object findTagsByModuleName(final @PathVariable("moduleName")String moduleName){

        log.debug("moduleName = {}.",moduleName);

        if(StringUtils.isEmpty(moduleName)){
            log.error("moduleName = {}.",moduleName);
            throw new IllegalArgumentException("moduleName is invalid");
        }
        Module module = moduleService.findByName(moduleName);

        if(module == null){
            log.error("moduleName = {}.",moduleName);
            throw new DataNotFoundException();
        }

        return new ReturnTemplate(tagService.findByModuleId(module.getId()));
    }

    private boolean isModuleIdValid(final String moduleId) {
        if(StringUtils.isEmpty(moduleId)){
            return false;
        }
        return moduleService.findById(moduleId) != null;
    }

    /**
     * 新增 module
     */
    @RequestMapping(value = {"/auth/module/new"},method = RequestMethod.POST)
    public Object addModule(final Module module){

        log.debug("module = {}.",module);

        if(!isModuleValid(module)){
            log.error("module = {}",module);
            throw new IllegalArgumentException("param is invalid");
        }

        moduleService.save(module);

        return new ReturnTemplate();
    }

    private boolean isModuleValid(final Module module) {
        if(StringUtils.isEmpty(module.getName())){
            return false;
        }
        return true;
    }
}
