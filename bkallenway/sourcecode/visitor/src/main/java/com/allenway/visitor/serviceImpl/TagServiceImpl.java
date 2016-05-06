package com.allenway.visitor.serviceImpl;

import com.allenway.visitor.dao.TagDao;
import com.allenway.visitor.entity.Tag;
import com.allenway.visitor.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by wuhuachuan on 16/4/2.
 */
@Service
public class TagServiceImpl implements TagService {

    @Autowired
    private TagDao tagDao;

    @Override
    public List<Tag> findAllTags() {
        return tagDao.findAllTags();
    }

    @Override
    public Tag findTagById(String tagId) {
        return tagDao.findTagById(tagId);
    }

    @Override
    public Tag save(Tag tag) {
        return tagDao.saveAndFlush(tag);
    }

    @Override
    public void delete(String id) {
        tagDao.deleteTag(id);
    }
}
