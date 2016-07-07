package com.allenway.scrum.service;

import com.allenway.scrum.entity.Item;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Created by wuhuachuan on 16/7/6.
 */
public interface ItemService {
    Item save(Item item);

    @Query("select item from Item item where userId = :userId and type = :type order by color")
    List<Item> findAllItemsByUserIdAndType(@Param("userId") String userId, String type);

    Item findItemById(String itemId);

    //判断该issue有多少个item
    int itemNum(String issueId);
}
