package com.allenway.scrum.service;

import com.allenway.scrum.entity.Issue;

import java.util.List;

/**
 * Created by wuhuachuan on 16/7/1.
 */
public interface IssueService {
    Issue save(Issue issue);

    List<Issue> findAllIssuesByUserId(String userid);

    Issue findIssueById(String issueId);
}
