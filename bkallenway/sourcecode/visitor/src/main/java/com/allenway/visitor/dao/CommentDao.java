package com.allenway.visitor.dao;

import com.allenway.visitor.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * CommentDao :
 *
 * @author wuhuachuan712@163.com
 * @date 16/9/14
 */
public interface CommentDao extends JpaRepository<Comment, String> {
    List<Comment> findByUsernameAndIsDelete(final String username,final boolean isDelete);
    List<Comment> findByArticleIdAndIsDelete(final String articleId,final boolean isDelete);
}
