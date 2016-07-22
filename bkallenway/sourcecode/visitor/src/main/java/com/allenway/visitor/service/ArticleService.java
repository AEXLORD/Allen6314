package com.allenway.visitor.service;


import com.allenway.visitor.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Created by wuhuachuan on 16/3/9.
 */
public interface ArticleService {

    Article saveArticle(Article article);
    void deleteArticle(Article article);

    /**
     * page: 需要第几页的数据
     * size: 每页有多少数据
     */
    List<Article> findArticlesByTagId(String tagId,String page,String size);

    /**
     * page: 需要第几页的数据
     * size: 每页有多少数据
     */
    @Deprecated
    List<Article> findArticlesByModuleId(String moduleId,String page,String size);

    List<Article> findArticlesByModuleName(String moduleName, String page, String size);

    Article findRandomArticle();
    Article findArticleById(String id);

    @Deprecated
    int sumArticleByModuleId(String moduleId);
    int sumArticleByTagId(String tagId);

    int sumArticleByModuleName(String moduleName);


}
