package com.allenway.visitor.serviceImpl;

import com.allenway.visitor.dao.ModuleDao;
import com.allenway.visitor.entity.Module;
import com.allenway.visitor.service.ModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by wuhuachuan on 16/5/30.
 */
@Service
public class ModuleServiceImpl implements ModuleService{

    @Autowired
    private ModuleDao moduleDao;

    @Override
    public void addModule(Module module) {
        moduleDao.saveAndFlush(module);
    }
}
