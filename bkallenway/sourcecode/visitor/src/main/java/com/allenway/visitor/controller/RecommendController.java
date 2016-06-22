package com.allenway.visitor.controller;

import com.allenway.utils.response.ReturnTemplate;
import com.allenway.utils.validparam.ValidUtils;
import com.allenway.visitor.entity.Recommend;
import com.allenway.visitor.service.RecommendService;
import com.allenway.visitor.support.RecommendClassify;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by wuhuachuan on 16/6/20.
 */

@RestController
@Slf4j
public class RecommendController {

    @Autowired
    private RecommendService recommendService;

    @RequestMapping(value = {"/recommend/find-recommends-by-classify","/auth/recommend/find-recommends-by-classify"}
            ,method = RequestMethod.GET)
    public Object findRecommedsByClassify(@RequestParam("classify") String clsasify){

        log.info("findRecommedByType function ... clsasify = {}",clsasify);

        if(ValidUtils.validIdParam(clsasify) && clsasify.equals(RecommendClassify.zhihu.toString())){
            ReturnTemplate returnTemplate = new ReturnTemplate();
            returnTemplate.addData("recommends",recommendService.findRecommedByClassify(clsasify));
            return returnTemplate;
        } else {
            throw new IllegalArgumentException("param is invalid!");
        }
    }

    @RequestMapping(value = {"/auth/recommend/add-recommend"},method = RequestMethod.POST)
    public Object addRecommend(Recommend recommend){
        if(validRecommend(recommend)){
            recommendService.save(recommend);
            return new ReturnTemplate();
        } else {
            throw new IllegalArgumentException("recommed is invalid!");
        }
    }

    private boolean validRecommend(Recommend recommend) {
        if(StringUtils.isEmpty(recommend.getProfile()) || StringUtils.isEmpty(recommend.getClassify())){
            return false;
        } else if(!recommend.getClassify().equals(RecommendClassify.zhihu.toString())){
            return false;
        } else {
            return true;
        }
    }

    @RequestMapping(value = {"/auth/recommend/find-all-recommends","/recommend/find-all-recommends"},method = RequestMethod.GET)
    public Object findAllRecommends(){
        ReturnTemplate returnTemplate = new ReturnTemplate();
        returnTemplate.addData("recommends",recommendService.findAllRecommends());
        return returnTemplate;
    }
}
