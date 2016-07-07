package com.allenway.scrum.controller;

import com.allenway.infrustructure.exception.DataNotFoundException;
import com.allenway.scrum.entity.Issue;
import com.allenway.scrum.entity.Item;
import com.allenway.scrum.service.IssueService;
import com.allenway.scrum.service.ItemService;
import com.allenway.utils.response.ReturnTemplate;
import com.allenway.utils.validparam.ValidUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by wuhuachuan on 16/7/6.
 */
@RestController
@Slf4j
public class ItemController {

    @Autowired
    private ItemService itemService;

    @Autowired
    private IssueService issueService;

    @RequestMapping(value = "/item/add-item",method = RequestMethod.POST)
    public Object addItem(Item item){
        if (validAddItemParam(item)){

            Issue issue = issueService.findIssueById(item.getIssueId());
            if(issue == null){
                throw new DataNotFoundException("issue isn't found by id offered by item");
            } else {
                item.setColor(issue.getColor());
                ReturnTemplate returnTemplate = new ReturnTemplate();
                returnTemplate.addData("item",itemService.save(item));
                return returnTemplate;
            }
        } else {
            throw new IllegalArgumentException("item param is invalid");
        }
    }

    private boolean validAddItemParam(Item item) {
        String name = item.getName();
        if(StringUtils.isEmpty(name) || name.length() > 15){
            return false;
        } else {
            return true;
        }
    }

    @RequestMapping(value = "/item/find-all-items",method = RequestMethod.GET)
    public Object findAllItems(String userid){

        log.info("findAllItems function ... userid = {}.",userid);

        if(ValidUtils.validIdParam(userid)){
            ReturnTemplate returnTemplate = new ReturnTemplate();

            returnTemplate.addData("items_icebox",itemService.findAllItemsByUserIdAndType(userid,"ICE BOX"));
            returnTemplate.addData("items_inprogress",itemService.findAllItemsByUserIdAndType(userid,"IN PROGRESS"));
            returnTemplate.addData("items_testing",itemService.findAllItemsByUserIdAndType(userid,"TESTING"));
            returnTemplate.addData("items_complete",itemService.findAllItemsByUserIdAndType(userid,"COMPLETE"));
            return returnTemplate;
        } else {
            throw new IllegalArgumentException("id is invalid");
        }
    }

    @RequestMapping(value = "/item/update-item-type",method = RequestMethod.POST)
    public Object updateItemType(String itemId,String type){

        log.info("itemId = {}. type = {}.",itemId,type);

        if(ValidUtils.validIdParam(itemId)){
            Item item = itemService.findItemById(itemId);
            if(item != null){
                item.setType(type);
                ReturnTemplate returnTemplate = new ReturnTemplate();
                returnTemplate.addData("item",itemService.save(item));
                return returnTemplate;
            } else {
                throw new DataNotFoundException("item isn't found by id offered by itemId");
            }
        } else {
            throw new IllegalArgumentException("item param is invalid");
        }
    }
}
