package com.allenway.scrum.controller;

import com.allenway.scrum.entity.Issue;
import com.allenway.scrum.service.IssueService;
import com.allenway.utils.response.ReturnTemplate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by wuhuachuan on 16/7/1.
 */

@RestController
@Slf4j
public class IssueController {

    @Autowired
    public IssueService issueService;

    @RequestMapping(value = "/issue/add-issue",method = RequestMethod.POST)
    public Object addIssue(Issue issue){
        if(validAddIssueParam(issue)){
            issueService.save(issue);
            return new ReturnTemplate();
        } else {
            throw new IllegalArgumentException("issue's name is invalid");
        }
    }

    private boolean validAddIssueParam(Issue issue) {
        String name = issue.getName();
        if(StringUtils.isEmpty(name) || name.length() > 8){
            return false;
        } else {
            return true;
        }
    }
}
