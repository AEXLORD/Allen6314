package com.allenway.visitor.service;

import com.allenway.visitor.entity.Tag;

import java.util.List;

/**
 * Created by wuhuachuan on 16/4/2.
 */
public interface TagService {
    List<Tag> findAllTags();

    Tag findTagById(String tagId);

    Tag save(Tag tag);

    void delete(String id);
}
