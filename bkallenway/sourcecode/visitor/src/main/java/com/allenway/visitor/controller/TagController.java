package com.allenway.visitor.controller;

import com.allenway.infrustructure.exception.DataNotFoundException;
import com.allenway.utils.response.ReturnTemplate;
import com.allenway.utils.validparam.ValidUtils;
import com.allenway.visitor.entity.Module;
import com.allenway.visitor.entity.Tag;
import com.allenway.visitor.service.ArticleService;
import com.allenway.visitor.service.ModuleService;
import com.allenway.visitor.service.TagService;
import com.allenway.visitor.support.TagType;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedList;
import java.util.List;
import java.util.Set;

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

    @Autowired
    private ModuleService moduleService;

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
        if(ValidUtils.validIdParam(tag.getName()) || tagTypeIsValid(tag.getType())) {
            ReturnTemplate returnTemplate = new ReturnTemplate();
            returnTemplate.addData("tag", tagService.saveTag(tag));
            return returnTemplate;
        } else {
            throw new IllegalArgumentException("tagName is null");
        }
    }

    private boolean tagTypeIsValid(String type) {
        if(StringUtils.isEmpty(type)){
            return true;
        } else if(type.equals(TagType.BASE) || type.equals(TagType.FRAME) || type.equals(TagType.OTHER)){
            return true;
        } else {
            return false;
        }
    }


    @RequestMapping(value = "/auth/tag/delete-tag-by-id",method = RequestMethod.POST)
    public Object deleteTagById(String id){

        if(ValidUtils.validIdParam(id)){
            Tag tag = tagService.findTagById(id);

            if(tagService.getArticleSumNumByTag(id) == 0){
                tagService.deleteTag(tag);
                return new ReturnTemplate();
            } else {
                throw new IllegalArgumentException("there are some articles belong to this tag,so delete failed");
            }
        } else {
            throw new IllegalArgumentException("id is invalid(null or sql attack)");
        }
    }

    @RequestMapping(value = {"/tag/find-tags-by-moduleid","/auth/tag/find-tags-by-moduleid"},method = RequestMethod.GET)
    public Object findTagsByModuleId(String moduleid){

        if(ValidUtils.validIdParam(moduleid)){
            ReturnTemplate returnTemplate = new ReturnTemplate();
            returnTemplate.addData("tags",tagService.findTagsByModuleId(moduleid));
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
                returnTemplate.addData("tags",findTagListByModuleId(tag.getModuleId()));
                return  returnTemplate;
            }
        } else {
            throw new IllegalArgumentException("tagid is invalid!");
        }
    }

    private List<Tag> findTagListByModuleId(String moduleId) {
        List<Tag> tagList = tagService.findTagsByModuleId(moduleId);
        tagList
                .parallelStream()
                .forEach(param ->{
                    param.setArticleNum(tagService.getArticleSumNumByTag(param.getId()));
                });
        return tagList;
    }

    @RequestMapping(value = {"/tag/find-tag-by-id","/auth/tag/find-tag-by-id"},method = RequestMethod.GET)
    public Object findTagById(String tagid){

        if(ValidUtils.validIdParam(tagid)){
            ReturnTemplate returnTemplate = new ReturnTemplate();
            returnTemplate.addData("tag",tagService.findTagById(tagid));
            return returnTemplate;
        } else {
            throw new IllegalArgumentException("module is invalid!");
        }
    }

    @RequestMapping(value = "/auth/tag/find-tagtype-by-moduleid",method = RequestMethod.GET)
    public Object findTagTypeByModuleId(@RequestParam String moduleid){

        log.info("findTagTypeByModuleId function ... moduleid = {}",moduleid);

        if(ValidUtils.validIdParam(moduleid)){
            Module module = moduleService.findModuleById(moduleid);

            ReturnTemplate returnTemplate = new ReturnTemplate();
            if(module.getName().equals("Learning")){
                List<String> list = new LinkedList<String>();
                list.add(TagType.BASE.getType());
                list.add(TagType.FRAME.getType());
                list.add(TagType.OTHER.getType());
                returnTemplate.addData("types",list);
            }
            return returnTemplate;
        } else {
            throw new IllegalArgumentException("moduleid == null!");
        }
    }

}
