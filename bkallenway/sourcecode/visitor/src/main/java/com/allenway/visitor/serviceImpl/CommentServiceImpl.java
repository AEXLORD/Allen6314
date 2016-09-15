package com.allenway.visitor.serviceImpl;

import com.allenway.visitor.dao.CommentDao;
import com.allenway.visitor.entity.Comment;
import com.allenway.visitor.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * CommentServiceImpl :
 *
 * @author wuhuachuan712@163.com
 * @date 16/9/14
 */
@Service
public class CommentServiceImpl implements CommentService{

    @Autowired
    private CommentDao commentDao;

    @Override
    public void save(final Comment comment) {
        commentDao.save(comment);
    }

    @Override
    public void saveall(final List<Comment> comments) {
        commentDao.save(comments);
    }

    @Override
    public Comment findById(final String id) {
        return commentDao.findOne(id);
    }

    /**
     * 默认查找 isDelete = false
     */
    @Override
    public List<Comment> findByUsername(final String username) {
        return commentDao.findByUsernameAndIsDelete(username,false);
    }

    /**
     * 默认查找 isDelete = false
     */
    @Override
    public List<Comment> findByArticleId(final String articleId) {
        return commentDao.findByArticleIdAndIsDelete(articleId,false);
    }

    /**
     * 管理员使用,查找 isDelete = false and true
     */
    @Override
    public List<Comment> findall() {
        return commentDao.findAll();
    }
}
