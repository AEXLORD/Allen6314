package com.allenway.visitor.serviceImpl;

import com.allenway.visitor.dao.ModuleDao;
import com.allenway.visitor.entity.Module;
import com.allenway.visitor.service.ModuleService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import java.util.Set;

/**
 * Created by wuhuachuan on 16/5/30.
 */
@Service
@Slf4j
public class ModuleServiceImpl implements ModuleService{

    @Autowired
    private ModuleDao moduleDao;

    @Override
    @CacheEvict(value = "modules",keyGenerator = "all_module")
    public Module save(Module module) {
        return moduleDao.saveAndFlush(module);
    }

    @Override
    public Set<Module> findAllModules() {
        return moduleDao.findAllModules();
    }

    @Override
    public Module findModuleById(String moduleid) {
        return moduleDao.findModuleByIdAndIsDelete(moduleid,"0");
    }
}
