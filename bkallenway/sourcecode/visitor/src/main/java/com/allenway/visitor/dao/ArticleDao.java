package com.allenway.visitor.dao;

import com.allenway.visitor.entity.Article;
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

    @Query(value = "select * from tb_article order by RAND() LIMIT ?1",nativeQuery = true)
    List<Article> findRandomArticle(final int size);

    /**
     *  查找某 tagId 下的所有文章（分页）
     */
    @Query("select article from Article article where tagId=:tagId")
    Page<Article> findByTagIdAndInPage(Pageable pageable, @Param("tagId") String tagId);

    List<Article> findByIsTop(boolean isTop);
}




