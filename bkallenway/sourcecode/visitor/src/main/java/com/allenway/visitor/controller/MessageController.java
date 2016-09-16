package com.allenway.visitor.controller;

import com.allenway.commons.exception.ex.DataNotFoundException;
import com.allenway.commons.exception.ex.UsernamePasswordWrongException;
import com.allenway.commons.response.ReturnTemplate;
import com.allenway.user.entity.User;
import com.allenway.user.service.UserService;
import com.allenway.utils.encryption.DESEncryptUtil;
import com.allenway.visitor.entity.Message;
import com.allenway.visitor.service.MessageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.websocket.server.PathParam;
import java.util.UUID;

/**
 * MessageController :
 *
 * @author wuhuachuan712@163.com
 * @date 16/9/16
 */

@Slf4j
@RestController
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService;

    /**
     * 新增留言
     */
    @RequestMapping(value = "/message/new",method = RequestMethod.POST)
    public Object save(final Message message, final @PathParam("password") String password){
        log.debug("message = {}.",message);

        if(!isMessageParamsValid(message,password)){
            throw new IllegalArgumentException("param is invalid");
        }

        //如果已经存在用户,那么验证帐号密码,
        //如果不存在,那么则保存该用户
        boolean handleSuccess = handlerUser(message, password);
        if(handleSuccess == false){
            throw new UsernamePasswordWrongException("");
        }

        return new ReturnTemplate<>(messageService.saveAndFlush(message));
    }

    /**
     * 找到全部的留言
     */
    @RequestMapping(value = "/message/findall",method = RequestMethod.GET)
    public Object findall(){
        return new ReturnTemplate<>(messageService.findall());
    }

    /**
     * 找到评论的对话部分
     */
    @RequestMapping(value = "/message/conversation",method = RequestMethod.POST)
    public Object conversation(final String username1,final String username2){
        if(!StringUtils.hasText(username1) || !StringUtils.hasText(username2)){
            throw new IllegalArgumentException();
        }

        if(userService.findByUsername(username1) == null || userService.findByUsername(username2) == null){
            throw new DataNotFoundException();
        }

        return new ReturnTemplate<>(messageService.findConversation(username1,username2));
    }

    /**
     * 验证新增的 message 参数是否合理
     *
     * username 最大 30 个字符
     * message.content 最大 70个字符.
     */
    private boolean isMessageParamsValid(final Message message,final String password) {
        if(message == null){
            return false;
        }
        if(!StringUtils.hasText(message.getUsername()) || message.getUsername().length() > 30){
            return false;
        }
        if(!StringUtils.hasText(password) || password.length() != 6){
            return false;
        }
        if(!StringUtils.hasText(message.getContent()) || message.getContent().length() > 70){
            return false;
        }
        return true;
    }

    private boolean handlerUser(final Message message, final String password) {
        User dbUser = userService.findByUsername(message.getUsername());

        //保存该用户
        if(dbUser == null){
            String salt = UUID.randomUUID().toString();
            userService.save(new User(message.getUsername(),
                    DESEncryptUtil.getPassphrase(DESEncryptUtil.getSalt(salt),password),
                    salt));
            return true;

        }

        //验证该用户帐号密码
        return DESEncryptUtil.matchPassphrase(dbUser.getPassword(),
                DESEncryptUtil.getSalt(dbUser.getSalt()),
                password);
    }
}
