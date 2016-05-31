package com.allenway.visitor.controller;

import com.allenway.infrustructure.exception.DataNotFoundException;
import com.allenway.utils.response.ReturnTemplate;
import com.allenway.utils.validparam.ValidUtils;
import com.allenway.visitor.entity.Tag;
import com.allenway.visitor.service.ArticleService;
import com.allenway.visitor.service.TagService;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by wuhuachuan on 16/4/2.
 */

@Slf4j
@Data
@RestController
public class TagController {

    @Autowired
    private TagService tagService;

    @Autowired
    private ArticleService articleService;

    @RequestMapping(value = {"/tag/find-all-tags","/auth/tag/find-all-tags"},method = RequestMethod.GET)
    public Object findAllTags(){
        ReturnTemplate returnTemplate = new ReturnTemplate();

        List<Tag> tagList = tagService.findAllTags();

        tagList
                .parallelStream()
                .forEach(param ->{
                    param.setArticleNum(tagService.getArticleSumNumByTag(param.getId()));
                });

        returnTemplate.addData("tags",tagList);
        return  returnTemplate;
    }


    @RequestMapping(value = "/auth/tag/add-tag",method = RequestMethod.POST)
    public Object addTag(Tag tag){
        if(ValidUtils.validIdParam(tag.getName())){
            ReturnTemplate returnTemplate = new ReturnTemplate();
            returnTemplate.addData("tag",tagService.saveTag(tag));
            return returnTemplate;
        } else {
            throw new IllegalArgumentException("tagName is null");
        }
    }


    @RequestMapping(value = "/auth/tag/delete-tag-by-id",method = RequestMethod.POST)
    public Object deleteTagById(String id){

        if(ValidUtils.validIdParam(id)){
            Tag tag = tagService.findTagById(id);

            if(tagService.getArticleSumNumByTag(id) == 0){
                tagService.deleteTagById(id);
                return new ReturnTemplate();
            } else {
                throw new IllegalArgumentException("there are some articles belong to this tag,so delete failed");
            }
        } else {
            throw new IllegalArgumentException("id is invalid(null or sql attack)");
        }
    }

    @RequestMapping(value = {"/tag/find-tags-by-moduleid","/auth/tag/find-tags-by-moduleid"},method = RequestMethod.GET)
    public Object findTagByModule(String moduleId){

        if(ValidUtils.validIdParam(moduleId)){
            ReturnTemplate returnTemplate = new ReturnTemplate();
            returnTemplate.addData("tags",tagService.findTagsByModuleId(moduleId));
            return returnTemplate;
        } else {
            throw new IllegalArgumentException("module is invalid!");
        }
    }

    @RequestMapping(value = {"/tag/find-all-tags-by-some-tag","/auth/tag/find-all-tags-by-some-tag"},method = RequestMethod.GET)
    public Object findAllTagsBySomeTagId(String tagId){
        ReturnTemplate returnTemplate = new ReturnTemplate();

        if(ValidUtils.validIdParam(tagId)){
            Tag tag = tagService.findTagById(tagId);
            if(tag == null){
                throw new DataNotFoundException("tag is not found!");
            } else {
                String moduleId = tag.getModuleId();

                List<Tag> tagList = tagService.findTagsByModuleId(moduleId);
                tagList
                        .parallelStream()
                        .forEach(param ->{
                            param.setArticleNum(tagService.getArticleSumNumByTag(param.getId()));
                        });

                returnTemplate.addData("tags",tagList);
                return  returnTemplate;
            }
        } else {
            throw new IllegalArgumentException("tagid is invalid!");
        }
    }

}
