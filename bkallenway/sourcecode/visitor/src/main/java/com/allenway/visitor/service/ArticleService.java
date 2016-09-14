package com.allenway.visitor.service;


import com.allenway.commons.page.PageHandler;
import com.allenway.visitor.entity.Article;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * Created by wuhuachuan on 16/3/9.
 */
public interface ArticleService {

    void save(final Article article);

    void delete(final Article article);

    Article findById(final String id);
    List<Article> findByIsTop();
    List<Article> findRandomArticle(final int size);
    List<Article> findall();

    /**
     * 查找某 tagId 下的所有文章（分页）
     */
    Page<Article> findByTagIdAndInPage(PageHandler pageHandler, final String tagId);



}
