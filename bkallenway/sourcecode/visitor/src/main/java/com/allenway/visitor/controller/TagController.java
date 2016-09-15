package com.allenway.visitor.controller;

import com.allenway.commons.exception.ex.OperationFailException;
import com.allenway.commons.response.ReturnTemplate;
import com.allenway.visitor.entity.Tag;
import com.allenway.visitor.service.ModuleService;
import com.allenway.visitor.service.TagService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.websocket.server.PathParam;

/**
 * Created by wuhuachuan on 16/4/2.
 */

@Slf4j
@RestController
public class TagController {

    @Autowired
    private TagService tagService;

    @Autowired
    private ModuleService moduleService;

    /**
     * 新增 tag
     */
    @RequestMapping(value = "/auth/tag/new",method = RequestMethod.POST)
    public Object addTag(final Tag tag){

        log.debug("tag = {}.",tag);

        if(!isTagValid(tag)){
            log.error("tag = {} ",tag);
            throw new IllegalArgumentException("tag param is invalid");
        }

        tagService.save(tag);
        return new ReturnTemplate();
    }

    /**
     * 删除 tag
     */
    @RequestMapping(value = "/auth/tag/delete",method = RequestMethod.POST)
    public Object deleteTagById(final @PathParam("id") String id){

        log.debug("id = {}.",id);

        if(!StringUtils.hasText(id)){
            throw new IllegalArgumentException("id is null or empty");
        }

        Tag tag = tagService.findById(id);
        if(tag == null){
            log.error("id = {}",id);
            throw new IllegalArgumentException("tag is null based on the id");
        }

        //如果 tag 底下还有文章,那么不能删除
        if(tag.getArticleNum() != 0){
            throw new OperationFailException("article num != 0");
        }

        tagService.delete(tag);
        return new ReturnTemplate();
    }

    /**
     * 查找所有的 tag
     * @return
     */
    @RequestMapping(value = "/tag/findall",method = RequestMethod.GET)
    public Object findall(){
        return new ReturnTemplate(tagService.findall());
    }

    private boolean isTagValid(final Tag tag) {
        if(tag == null){
            return false;
        }
        if(!StringUtils.hasText(tag.getName())) {
            return false;
        }
        if(!StringUtils.hasText(tag.getModuleId())) {
            return false;
        }
        return moduleService.findById(tag.getModuleId()) != null;
    }
}
