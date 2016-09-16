package com.allenway.visitor.dao;

import com.allenway.visitor.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * MessageDao :
 *
 * @author wuhuachuan712@163.com
 * @date 16/9/16
 */
public interface MessageDao extends JpaRepository<Message,String> {

    @Query("select message from Message message where isDelete=false order by operationTime")
    List<Message> findall();

    @Query("select message from Message message where (username=:username1 and replyTo=:username2) or " +
                                                      "(username=:username2 and replyTo=:username1) " +
                                                      "order by operationTime")
    List<Message> findConversation(final @Param("username1") String username1,
                                   final @Param("username2") String username2);
}
