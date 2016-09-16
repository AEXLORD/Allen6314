package com.allenway.visitor.controller;

import com.allenway.commons.exception.ex.DataNotFoundException;
import com.allenway.commons.exception.ex.UsernamePasswordWrongException;
import com.allenway.commons.response.ReturnTemplate;
import com.allenway.user.entity.User;
import com.allenway.user.service.UserService;
import com.allenway.utils.encryption.DESEncryptUtil;
import com.allenway.visitor.entity.Comment;
import com.allenway.visitor.service.ArticleService;
import com.allenway.visitor.service.CommentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.websocket.server.PathParam;
import java.util.UUID;

/**
 * CommentController :
 *
 * @author wuhuachuan712@163.com
 * @date 16/9/14
 */

@Slf4j
@RestController
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserService userService;

    @Autowired
    private ArticleService articleService;

    /**
     * 新增评论
     */
    @RequestMapping(value = "/comment/new",method = RequestMethod.POST)
    public Object save(final Comment comment,final @PathParam("password") String password){
        log.debug("comment = {}.",comment);

        if(!isCommentParamsValid(comment,password)){
            throw new IllegalArgumentException("param is invalid");
        }

        //如果已经存在用户,那么验证帐号密码,
        //如果不存在,那么则保存该用户
        boolean handleSuccess = handlerUser(comment, password);
        if(handleSuccess == false){
            throw new UsernamePasswordWrongException("");
        }

        return new ReturnTemplate<>(commentService.saveAndFlush(comment));
    }

    /**
     * 找到所有的评论
     */
    @RequestMapping(value = "/auth/comment/findall",method = RequestMethod.GET)
    public Object findall(){
        return new ReturnTemplate<>(commentService.findall());
    }

    /**
     * 找到评论的对话部分
     */
    @RequestMapping(value = "/comment/conversation",method = RequestMethod.POST)
    public Object conversation(final String username1,final String username2){
        if(!StringUtils.hasText(username1) || !StringUtils.hasText(username2)){
            throw new IllegalArgumentException();
        }

        if(userService.findByUsername(username1) == null || userService.findByUsername(username2) == null){
            throw new DataNotFoundException();
        }

        return new ReturnTemplate<>(commentService.findConversation(username1,username2));
    }

    /**
     * 验证新增的 comment 参数是否合理
     *
     * username 最大 30 个字符
     * comment.content 最大 70个字符.
     */
    private boolean isCommentParamsValid(final Comment comment,final String password) {

        if(comment == null){
            return false;
        }

        if(!StringUtils.hasText(comment.getUsername()) || comment.getUsername().length() > 30){
            return false;
        }

        if(!StringUtils.hasText(password) || password.length() != 6){
            return false;
        }

        if(!StringUtils.hasText(comment.getArticleId())
                || articleService.findById(comment.getArticleId()) == null){
            return false;
        }

        if(!StringUtils.hasText(comment.getContent()) || comment.getContent().length() > 70){
            return false;
        }

        return true;
    }

    private boolean handlerUser(final Comment comment, final String password) {
        User dbUser = userService.findByUsername(comment.getUsername());

        //保存该用户
        if(dbUser == null){
            String salt = UUID.randomUUID().toString();
            userService.save(new User(comment.getUsername(),
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
