package com.allenway.visitor.dao;

import com.allenway.visitor.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Created by wuhuachuan on 16/6/3.
 */
public interface MessageDao extends JpaRepository<Message,String> {
    @Query("select count(message) from Message message where isDelete = '0'")
    int sumMessages();

    @Query(value = "select * from tb_message where is_delete = '0' LIMIT =:begin , =:offset",nativeQuery = true)
    List<Object> findMessageByPage(@Param("begin") int begin, @Param("offset") int offset);

    @Query("select message from Message message where isDelete = '0' order by createDate asc")
    List<Message> findAllMessages();
}
