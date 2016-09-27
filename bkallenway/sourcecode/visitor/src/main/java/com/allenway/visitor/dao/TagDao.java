package com.allenway.visitor.dao;

import com.allenway.visitor.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


/**
 * Created by wuhuachuan on 16/4/2.
 */
public interface TagDao extends JpaRepository<Tag, String> {
    List<Tag> findByModuleId(final String moduleId);
    Tag findByName(final String name);

    @Query(value = "select tag from Tag tag where isDelete = false")
    List<Tag> findAllTags();
}
