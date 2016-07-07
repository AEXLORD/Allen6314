package com.allenway.scrum.serviceImpl;

import com.allenway.scrum.dao.ItemDao;
import com.allenway.scrum.entity.Item;
import com.allenway.scrum.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by wuhuachuan on 16/7/6.
 */

@Service
public class ItemServiceImpl implements ItemService {

    @Autowired
    private ItemDao itemDao;

    @Override
    public Item save(Item item) {
        return itemDao.saveAndFlush(item);
    }

    @Override
    public List<Item> findAllItemsByUserIdAndType(String userid, String icebox) {
        return itemDao.findAllItemsByUserIdAndTypeAndIsDelete(userid,icebox,"0");
    }

    @Override
    public Item findItemById(String itemId) {
        return itemDao.findItemById(itemId);
    }

    @Override
    public int itemNum(String issueId) {
        return itemDao.itemNum(issueId);
    }
}
