package com.allenway.scrum.dao;

import com.allenway.scrum.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Created by wuhuachuan on 16/7/6.
 */
public interface ItemDao extends JpaRepository<Item,String> {
    List<Item> findAllItemsByUserIdAndTypeAndIsDelete(String userid, String icebox, String isDelete);

    Item findItemById(String itemId);

    @Query("select count(item) from Item item where issueId=:issueId and isDelete = '0'")
    int itemNum(@Param("issueId") String issueId);
}
