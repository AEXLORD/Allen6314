package com.allenway.visitor.service;


import com.allenway.visitor.entity.Article;

import java.util.List;

/**
 * Created by wuhuachuan on 16/3/9.
 */
public interface ArticleService {

    Article saveArticle(Article article);

    void deleteArticle(Article article);

    Article findArticleById(String id);

    List<Article> findAllArticles();

    List<Article> findArticlesByTagId(String tagId);

    Article findRandomArticle();

    List<Article> findAllArticlesByModuleId(String moduleId);
}
