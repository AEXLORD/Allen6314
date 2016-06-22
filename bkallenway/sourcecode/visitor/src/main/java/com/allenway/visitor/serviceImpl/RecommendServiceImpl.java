package com.allenway.visitor.serviceImpl;

import com.allenway.visitor.dao.RecommendDao;
import com.allenway.visitor.entity.Recommend;
import com.allenway.visitor.service.RecommendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;

/**
 * Created by wuhuachuan on 16/6/20.
 */

@Service
public class RecommendServiceImpl implements RecommendService {

    @Autowired
    private RecommendDao recommendDao;

    @Override
    public Set<Recommend> findRecommedByClassify(String classify) {
        return recommendDao.findRecommendByClassifyAndIsDelete(classify,"0");
    }

    @Override
    public void save(Recommend recommend) {
        recommendDao.saveAndFlush(recommend);
    }

    @Override
    public Set<Recommend> findAllRecommends() {
        return recommendDao.findRecommendByIsDelete("0");
    }
}
