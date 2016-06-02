package com.allenway.visitor.serviceImpl;

import com.allenway.visitor.dao.UserDao;
import com.allenway.visitor.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by wuhuachuan on 16/5/31.
 */
@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserDao userDao;
}
