package com.allenway.visitor.dao;

import com.allenway.visitor.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


/**
 * Created by wuhuachuan on 16/4/2.
 */
public interface TagDao extends JpaRepository<Tag, String> {
    List<Tag> findByModuleId(String moduleId);

    Tag findByName(String name);
}
