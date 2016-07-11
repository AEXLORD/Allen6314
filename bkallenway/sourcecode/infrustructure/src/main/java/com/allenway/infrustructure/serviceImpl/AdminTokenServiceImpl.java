package com.allenway.infrustructure.serviceImpl;

import com.allenway.infrustructure.dao.AdminTokenDao;
import com.allenway.infrustructure.entity.AdminToken;
import com.allenway.infrustructure.service.AdminTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by wuhuachuan on 16/7/11.
 */
@Service
public class AdminTokenServiceImpl implements AdminTokenService {

    @Autowired
    private AdminTokenDao adminTokenDao;

    @Override
    public void save(AdminToken adminToken) {
        adminTokenDao.saveAndFlush(adminToken);
    }
}
