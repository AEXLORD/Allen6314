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
    public void save(final Tag tag) {
        tagDao.save(tag);
    }

    @Override
    public Tag saveAndFlush(final Tag tag) {
        return tagDao.saveAndFlush(tag);
    }

    @Override
    public List<Tag> findByModuleId(final String moduleId) {
        return tagDao.findByModuleId(moduleId);
    }

    @Override
    public Tag findById(final String tagId) {
        return tagDao.findOne(tagId);
    }

    @Override
    public Tag findByName(final String name) {
        return tagDao.findByName(name);
    }

    @Override
    public List<Tag> findall() {
        return tagDao.findAllTags();
    }

    @Override
    public void delete(final Tag tag) {
        tag.setIsDelete(true);
        this.save(tag);
    }
}
