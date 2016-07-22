package com.allenway.visitor.controller;

import com.allenway.infrustructure.exception.DataNotFoundException;
import com.allenway.utils.response.ReturnTemplate;
import com.allenway.utils.validparam.ValidUtils;
import com.allenway.visitor.entity.Module;
import com.allenway.visitor.service.ModuleService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by wuhuachuan on 16/5/30.
 *
 * 目前暂时不用,而是采用前端写死的方式.
 */
@Deprecated
@Slf4j
@RestController
public class ModuleController {

    @Autowired
    private ModuleService moduleService;

    @RequestMapping(value = "/auth/module/add-module",method = RequestMethod.POST)
    public Object addModule(Module module){
        ReturnTemplate returnTemplate = new ReturnTemplate();
        returnTemplate.addData("module",moduleService.save(module));
        return returnTemplate;
    }

    @RequestMapping(value = {"/auth/module/find-all-modules","/module/find-all-modules"},method = RequestMethod.GET)
    public Object findAllModules(){
        ReturnTemplate returnTemplate = new ReturnTemplate();
        returnTemplate.addData("modules",moduleService.findAllModules());
        return returnTemplate;
    }

    @RequestMapping(value = "/auth/module/delete-module-by-id",method = RequestMethod.POST)
    public Object deleteModuleById(String id){
        if(ValidUtils.validIdParam(id)){
            Module module = moduleService.findModuleById(id);

            if(module != null){
                module.setIsDelete("1");
                moduleService.save(module);
                return new ReturnTemplate();
            } else {
                throw new DataNotFoundException("module isn't found");
            }
        } else {
            throw new IllegalArgumentException("id is invalid");
        }
    }
}
