package com.allenway.visitor.service;

import com.allenway.visitor.entity.Tag;

import java.util.List;

/**
 * Created by wuhuachuan on 16/4/2.
 */
public interface TagService {
    List<Tag> findAllTags();

    Tag findTagById(String tagId);
    Tag findTagByName(String tagName);

    Tag saveTag(Tag tag);

    void deleteTag(Tag tag);

    //得到该tag 下的文章数量
    int getArticleSumNumByTag(String tagId);

    List<Tag> findTagsByModuleId(String moduleId);


}
