package com.allenway.scrum.serviceImpl;

import com.allenway.scrum.dao.IssueDao;
import com.allenway.scrum.entity.Issue;
import com.allenway.scrum.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by wuhuachuan on 16/7/1.
 */

@Service
public class IssueServiceImpl implements IssueService {

    @Autowired
    private IssueDao issueDao;

    @Override
    public void save(Issue issue) {
        issueDao.saveAndFlush(issue);
    }
}
