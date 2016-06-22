package com.allenway.visitor.service;

import com.allenway.visitor.entity.Recommend;

import java.util.Set;

/**
 * Created by wuhuachuan on 16/6/20.
 */
public interface RecommendService {
    Set<Recommend> findRecommedByClassify(String classify);

    void save(Recommend recommend);

    Set<Recommend> findAllRecommends();
}
