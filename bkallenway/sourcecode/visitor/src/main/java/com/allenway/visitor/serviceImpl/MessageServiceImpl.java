package com.allenway.visitor.serviceImpl;

import com.allenway.visitor.dao.MessageDao;
import com.allenway.visitor.entity.Message;
import com.allenway.visitor.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;

/**
 * Created by wuhuachuan on 16/6/3.
 */

@Service
public class MessageServiceImpl implements MessageService {

    @Autowired
    private MessageDao messageDao;

    @Override
    public int getFloor() {
        return messageDao.sumMessages() + 1;
    }

    @Override
    public void save(Message message) {
        messageDao.saveAndFlush(message);
    }

    @Override
    public int sumMessages() {
        return messageDao.sumMessages();
    }

    @Override
    public List<Message> findMessagesByPage(String page, String size) {

        int _page = Integer.parseInt(page);
        int _size = Integer.parseInt(size);

        //得到总共的页数
        int totalSize = messageDao.sumMessages();
        int totalPages = (int) Math.ceil((float) totalSize / _size);

        List<Message> messageWithOutPage  = messageDao.findAllMessages();
        List<Message> messageWithPage  = new LinkedList<Message>();

        if(_page > totalPages ){
            return null;
        } else if(totalPages == 1){
            return messageWithOutPage;
        } else {
            int begin = (_page - 1) * _size ;
            int end;

            if( (totalSize - begin) < _size){
                end = totalSize;
            } else {
                end = begin + _size;
            }

            for (int i = begin; i < end; i++) {
                messageWithPage.add(messageWithOutPage.get(i));
            }
            return messageWithPage;
        }

    }
}
