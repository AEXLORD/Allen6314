package com.allenway.visitor.service;

import com.allenway.visitor.entity.Message;

import java.util.List;

/**
 * Created by wuhuachuan on 16/6/3.
 */
public interface MessageService {
    int getFloor();

    void save(Message message);

    int sumMessages();

    List<Message> findMessagesByPage(String page, String size);

    void deleteMessageById(String messageid);
}
