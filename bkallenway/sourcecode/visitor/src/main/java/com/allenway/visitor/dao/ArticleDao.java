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

    @Deprecated
    @Query(value = "select * from tb_article order by RAND() LIMIT ?1 order by operationTime",nativeQuery = true)
    List<Article> findRandomArticle(final int size);

    @Query("select article.id,article.title,article.tagId from Article article where moduleId=:moduleId and isDelete=:isDelete order by operationTime")
    Page<Object> findByModuleIdAndInPage(Pageable pageable,
                                          final @Param("moduleId") String moduleId,
                                          final @Param("isDelete") boolean isDelete);
    /**
     *  查找某 tagId 下的所有文章（分页）给游客使用
     */
    @Query("select article.id,article.title,article.tagId from Article article where tagId=:tagId and isDelete=:isDelete order by operationTime")
    Page<Object> findByTagIdAndInPage(Pageable pageable,
                                       final @Param("tagId") String tagId,
                                       final @Param("isDelete") boolean isDelete);

    /**
     *  查找某 tagId 下的所有文章（分页）给管理员使用
     */
    @Query("select article.id,article.title,article.tagId from Article article where tagId=:tagId order by operationTime")
    Page<Object> findByTagIdAndInPageForAdmin(Pageable pageable,
                                               final @Param("tagId") String tagId);

    List<Article> findByIsTop(final boolean isTop);
    List<Article> findByIsDelete(final boolean isDelete);
}




