package com.allenway.user.serviceImpl;

import com.allenway.user.dao.AdminDao;
import com.allenway.user.entity.Admin;
import com.allenway.user.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by wuhuachuan on 16/3/3.
 */


@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminDao adminDao;

    @Override
    public void save(final Admin admin) {
        adminDao.save(admin);
    }

    @Override
    public Admin saveAndFlush(final Admin admin) {
        return adminDao.saveAndFlush(admin);
    }

    @Override
    public Admin findById(final String id) {
        return adminDao.findOne(id);
    }

    @Override
    public Admin findByUsername(final String username) {
        return adminDao.findByUsername(username);
    }
}
