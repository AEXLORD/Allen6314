package com.allenway.visitor.controller;

import com.allenway.utils.response.ReturnTemplate;
import com.allenway.visitor.entity.Module;
import com.allenway.visitor.service.ModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by wuhuachuan on 16/5/30.
 */
@RestController
public class ModuleController {

    @Autowired
    private ModuleService moduleService;

    @RequestMapping(value = "/auth/module/add-module",method = RequestMethod.POST)
    public Object addModule(Module module){
        moduleService.addModule(module);
        return new ReturnTemplate();
    }
}
