package com.allenway.user.service;


import com.allenway.user.entity.Admin;

/**
 * Created by wuhuachuan on 16/3/3.
 */
public interface AdminService {

    void save(final Admin admin);
    Admin saveAndFlush(final Admin admin);

    Admin findById(final String id);
    Admin findByUsername(final String username);
}
