package com.allenway.visitor.dao;

import com.allenway.visitor.entity.Article;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Created by wuhuachuan on 16/3/9.
 */
public interface ArticleDao extends JpaRepository<Article, String> {

    @Query(value = "select * from tb_article where is_delete = '0' order by RAND() LIMIT 1",nativeQuery = true)
    Article findRandomArticle();

    @Cacheable(value = "article",keyGenerator = "article_id")
    Article findArticleById(String id);

    @Query("select article from Article article where tagId = :tagId and isDelete = '0' order by createDate asc")
    List<Article> findArticleByTagId(@Param("tagId") String tagId);

    @Query("select article from Article article where moduleId = :moduleId and isDelete = '0' order by createDate asc")
    List<Article> findArticleByModuleId(@Param("moduleId") String moduleId);

    @Query("select count(article) from Article article where moduleId=:moduleId and isDelete = '0'")
    int sumArticlesByModuleId(@Param("moduleId") String moduleId);

    @Query("select count(article) from Article article where tagId=:tagId and isDelete = '0'")
    int sumArticlesByTagId(@Param("tagId") String tagId);
}




