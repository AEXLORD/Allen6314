package com.allenway.visitor.dao;

import com.allenway.visitor.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * Created by wuhuachuan on 16/3/9.
 */
public interface ArticleDao extends JpaRepository<Article, String> {

    Article findArticleByIdAndIsDelete(String id,boolean isDelete);

    @Query(value = "select article from Article article where isDelete=false order by createDate")
    List<Article> findAllArticles();

    List<Article> findArticleByTagId(String tagId);

    @Query(value = "select * from tb_article order by RAND() LIMIT 1",nativeQuery = true)
    Article findRandomArticle();
}




