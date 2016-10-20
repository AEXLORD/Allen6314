package com.allenway.visitor.service;

import com.allenway.visitor.entity.Comment;

import java.util.List;

/**
 * CommentService :
 *
 * @author wuhuachuan712@163.com
 * @date 16/9/14
 */
public interface CommentService {

    void save(final Comment comment);
    Comment saveAndFlush(final Comment comment);
    void saveall(final List<Comment> comments);

    Comment findById(final String id);
    List<Comment> findByUsername(final String username);
    List<Comment> findByArticleId(final String articleId);
    List<Comment> findByArticleIdIgnoreIsDelete(final String articleId);

    //管理员使用该放方法
    List<Comment> findall();

    List<Comment> findConversation(final String username1,final String username2);
}
