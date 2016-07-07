package com.allenway.scrum.dao;

import com.allenway.scrum.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Created by wuhuachuan on 16/7/1.
 */
public interface IssueDao extends JpaRepository<Issue,String> {

    @Query("select issue from Issue issue where userId = :userId and isDelete = :isDelete order by color")
    List<Issue> findIssueByUserIdAndIsDelete(@Param("userId") String userId, @Param("isDelete") String isDelete);

    Issue findIssueById(String issueId);
}
