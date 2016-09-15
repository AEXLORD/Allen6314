package com.allenway.user.serviceImpl;

import com.allenway.user.dao.UserDao;
import com.allenway.user.entity.User;
import com.allenway.user.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * UserServiceImpl :
 *
 * @author wuhuachuan712@163.com
 * @date 16/9/15
 */
@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao;

    @Override
    public void save(final User user) {
        userDao.save(user);
    }

    @Override
    public User findById(final String id) {
        return userDao.findOne(id);
    }

    @Override
    public User findByUsername(final String username) {
        return userDao.findByUsername(username);
    }
}
