package com.allenway.scrum.serviceImpl;

import com.allenway.scrum.dao.IssueDao;
import com.allenway.scrum.entity.Issue;
import com.allenway.scrum.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by wuhuachuan on 16/7/1.
 */

@Service
public class IssueServiceImpl implements IssueService {

    @Autowired
    private IssueDao issueDao;

    @Override
    public Issue save(Issue issue) {
        return issueDao.saveAndFlush(issue);
    }

    @Override
    public List<Issue> findAllIssuesByUserId(String userid) {
        return issueDao.findIssueByUserIdAndIsDelete(userid,"0");
    }

    @Override
    public Issue findIssueById(String issueId) {
        return issueDao.findIssueById(issueId);
    }
}
