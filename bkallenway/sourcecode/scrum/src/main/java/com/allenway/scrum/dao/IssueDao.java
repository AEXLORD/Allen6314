package com.allenway.scrum.dao;

import com.allenway.scrum.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Created by wuhuachuan on 16/7/1.
 */
public interface IssueDao extends JpaRepository<Issue,String> {
}
