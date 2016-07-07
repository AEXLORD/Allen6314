package com.allenway.scrum.controller;

import com.allenway.scrum.entity.Issue;
import com.allenway.scrum.service.IssueService;
import com.allenway.utils.response.ReturnTemplate;
import com.allenway.utils.validparam.ValidUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
            ReturnTemplate returnTemplate = new ReturnTemplate();
            returnTemplate.addData("issue",issueService.save(issue));
            return returnTemplate;
        } else {
            throw new IllegalArgumentException("issue's name is invalid");
        }
    }

    private boolean validAddIssueParam(Issue issue) {
        String name = issue.getName();
        if(StringUtils.isEmpty(name) || name.length() > 10){
            return false;
        } else {
            return true;
        }
    }

    @RequestMapping(value = "/issue/find-all-issues",method = RequestMethod.GET)
    public Object findAllIssues(String userid){

        log.info("findAllissues function ... userid = {}.",userid);

        if(ValidUtils.validIdParam(userid)){
            ReturnTemplate returnTemplate = new ReturnTemplate();
            returnTemplate.addData("issues",issueService.findAllIssuesByUserId(userid));
            return returnTemplate;
        } else {
            throw new IllegalArgumentException("id is invalid");
        }
    }
}
