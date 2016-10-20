package com.allenway.visitor.dao;

import com.allenway.visitor.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * CommentDao :
 *
 * @author wuhuachuan712@163.com
 * @date 16/9/14
 */
public interface CommentDao extends JpaRepository<Comment, String> {

    @Query("select comment from Comment comment where username=:username and isDelete=:isDelete order by operationTime")
    List<Comment> findByUsernameAndIsDelete(final @Param("username") String username,
                                            final @Param("isDelete") boolean isDelete);

    @Query("select comment from Comment comment where articleId=:articleId and isDelete=:isDelete order by operationTime")
    List<Comment> findByArticleIdAndIsDelete(final @Param("articleId") String articleId,
                                             final @Param("isDelete") boolean isDelete);

    @Query("select comment from Comment comment where articleId=:articleId order by operationTime")
    List<Comment> findByArticleIdAndIsDeleteIgnoreIsDelete(final @Param("articleId") String articleId);

    @Query("select comment from Comment comment where (username=:username1 and replyTo=:username2) or " +
                                                     "(username=:username2 and replyTo=:username1) " +
                                                     "order by operationTime")
    List<Comment> findConversation(final @Param("username1") String username1,
                                   final @Param("username2") String username2);


}
