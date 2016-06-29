package com.allenway.user.serviceImpl;

import com.allenway.user.dao.UserTokenDao;
import com.allenway.user.entity.UserToken;
import com.allenway.user.service.UserService;
import com.allenway.user.service.UserTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by wuhuachuan on 16/6/29.
 */

@Service
public class UserTokenServiceImpl implements UserTokenService {

    @Autowired
    private UserTokenDao userTokenDao;

    @Autowired
    private UserService userService;

    @Override
    public void save(UserToken userToken) {
        UserToken userToken1 = this.findUserTokenByUserId(userToken.getUserId());
        if(userToken1 != null){
            userToken1.setToken(userToken.getToken());
            userTokenDao.saveAndFlush(userToken1);
        } else {
            userTokenDao.saveAndFlush(userToken);
        }
    }

    @Override
    public UserToken findUserTokenByToken(String token) {
        return userTokenDao.findUserTokenByToken(token);
    }

    @Override
    public UserToken findUserTokenByUserId(String userId) {
        return userTokenDao.findUserTokenByUserId(userId);
    }

    @Override
    public void delete(UserToken userToken) {
        userTokenDao.delete(userToken);
    }
}
