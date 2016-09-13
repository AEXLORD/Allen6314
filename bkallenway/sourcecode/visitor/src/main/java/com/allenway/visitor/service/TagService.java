package com.allenway.visitor.service;

import com.allenway.visitor.model.Tag;

import java.util.List;

/**
 * Created by wuhuachuan on 16/4/2.
 */
public interface TagService {

    void save(final Tag tag);
    Tag saveAndFlush(final Tag tag);

    List<Tag> findByModuleId(final String moduleId);
    Tag findById(final String tagId);
    Tag findByName(String name);
    List<Tag> findall();

    void delete(final Tag tag);



}
