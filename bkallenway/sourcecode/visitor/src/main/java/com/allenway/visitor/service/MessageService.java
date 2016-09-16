package com.allenway.visitor.service;

import com.allenway.visitor.entity.Message;

import java.util.List;

/**
 * MessageService :
 *
 * @author wuhuachuan712@163.com
 * @date 16/9/16
 */
public interface MessageService {

    Message saveAndFlush(final Message message);

    Message findById(final String id);
    List<Message> findall();

    List<Message> findConversation(final String username1, final String username2);
}
