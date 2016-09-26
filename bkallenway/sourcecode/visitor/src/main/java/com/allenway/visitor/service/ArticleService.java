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
    Article saveAndFlush(final Article article);

    void delete(final Article article);

    Article findById(final String id);
    List<Article> findall(); // 给游客使用
    List<Article> findallForAdmin();  // 给管理员使用

    Page<Object> findByModuleIfAndInPage(PageHandler pageHandler,final String moduleId);

    /**
     * 查找某 tagId 下的所有文章（分页）
     */
    Page<Object> findByTagIdAndInPage(PageHandler pageHandler, final String tagId); // 给游客使用
    Page<Object> findByTagIdAndInPageForAdmin(PageHandler pageHandler,final String tagId); // 给管理员使用

    @Deprecated
    List<Article> findByIsTop();
    @Deprecated
    List<Article> findRandomArticle(final int size);
}
