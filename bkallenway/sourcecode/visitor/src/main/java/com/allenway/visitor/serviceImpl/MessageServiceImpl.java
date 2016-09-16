package com.allenway.visitor.serviceImpl;

import com.allenway.visitor.dao.MessageDao;
import com.allenway.visitor.entity.Message;
import com.allenway.visitor.service.MessageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * MessageServiceImpl :
 *
 * @author wuhuachuan712@163.com
 * @date 16/9/16
 */

@Slf4j
@Service
public class MessageServiceImpl implements MessageService {

    @Autowired
    private MessageDao messageDao;

    @Override
    public Message saveAndFlush(final Message message) {
        return messageDao.saveAndFlush(message);
    }

    @Override
    public Message findById(final String id) {
        return messageDao.findOne(id);
    }

    @Override
    public List<Message> findall() {
        return messageDao.findall();
    }

    @Override
    public List<Message> findConversation(final String username1, final String username2) {
        List<Message> messages = messageDao.findConversation(username1,username2);

        //由于上面查出的都是对话,没有一开始的源头这一条,所以以下加上
        Message messageFirst = this.findById(messages.get(0).getSourceMessageId());
        messages.add(0,messageFirst);

        return messages;
    }
}
