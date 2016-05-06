package com.allenway.visitor.controller;

import com.allenway.utils.response.ReturnTemplate;
import com.allenway.utils.validparam.ValidUtils;
import com.allenway.visitor.entity.Article;
import com.allenway.visitor.entity.Tag;
import com.allenway.visitor.service.ArticleService;
import com.allenway.visitor.service.TagService;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
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

    /**
     * 查找全部的 tag
     * @return
     */
    @RequestMapping(value = "/tag/find-all-tags",method = RequestMethod.GET)
    public Object findAllTags(){

        ReturnTemplate returnTemplate = new ReturnTemplate();
        returnTemplate.addData("tags",tagService.findAllTags());
        return  returnTemplate;
    }

    /**
     * 添加 Tag
     * @param tag
     * @return
     */
    @RequestMapping(value = "/auth/tag/add-tag",method = RequestMethod.POST)
    public Object addTag(Tag tag){

        if(validTagParam(tag)){
            ReturnTemplate returnTemplate = new ReturnTemplate();
            returnTemplate.addData("tag",tagService.save(tag));
            return returnTemplate;
        } else {
            throw new IllegalArgumentException();
        }
    }

    /**
     * 删除 tag
     * @param id
     * @return
     */
    @RequestMapping(value = "/auth/tag/delete-tag",method = RequestMethod.POST)
    public Object addTag( String id){

        if(ValidUtils.validIdParam(id)){
            ReturnTemplate returnTemplate = new ReturnTemplate();

            Tag tag = tagService.findTagById(id);

            if(tag == null || tag.getArticleNum() != 0){
                throw new IllegalArgumentException("articleNum != 0");
            } else {
                tagService.delete(id);
                return returnTemplate;
            }
        } else {
            throw new IllegalArgumentException();
        }
    }

    /**
     * 验证 Tag 的参数是否合理
     * @return
     */
    private boolean validTagParam(Tag tag) {
        return ValidUtils.validIdParam(tag.getName());
    }


    /**
     * 找出某一Tag 分类下的文章
     * @param tagId
     * @return
     */
    @RequestMapping(value = "/tag/find-articles-by-tag/{tagId}",method = RequestMethod.GET)
    public Object findArticlesByTagId(@PathVariable("tagId")String tagId){

        if(ValidUtils.validIdParam(tagId)){
            ReturnTemplate returnTemplate = new ReturnTemplate();
            List<Article> articles = articleService.findArticlesByTagId(tagId);
            returnTemplate.addData("articles",articles);
            return returnTemplate;
        } else {
            throw new IllegalArgumentException();
        }
    }
}
