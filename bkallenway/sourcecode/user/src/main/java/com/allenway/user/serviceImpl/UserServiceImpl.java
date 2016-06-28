package com.allenway.user.serviceImpl;

import com.allenway.user.dao.UserDao;
import com.allenway.user.entity.User;
import com.allenway.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by wuhuachuan on 16/5/31.
 */
@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserDao userDao;

    @Override
    public void save(User user) {
        userDao.saveAndFlush(user);
    }

    @Override
    public User findUserByUsername(String username) {
        return userDao.findUserByUsernameAndIsDelete(username,"0");
    }
}
