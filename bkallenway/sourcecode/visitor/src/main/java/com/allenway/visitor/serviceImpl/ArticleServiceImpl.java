package com.allenway.visitor.serviceImpl;

import com.allenway.commons.page.PageHandler;
import com.allenway.visitor.dao.ArticleDao;
import com.allenway.visitor.entity.Article;
import com.allenway.visitor.service.ArticleService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by wuhuachuan on 16/3/9.
 */

@Service
@Slf4j
public class ArticleServiceImpl implements ArticleService {

    @Autowired
    private ArticleDao articleDao;

    @Override
    public void save(final Article article) {
        articleDao.save(article);
    }

    @Override
    public void delete(final Article article) {
        article.setIsDelete(true);
        articleDao.save(article);
    }

    @Override
    public Article findById(final String id) {
        return articleDao.findOne(id);
    }

    @Override
    public List<Article> findByIsTop() {
        return articleDao.findByIsTop(true);
    }

    @Override
    public List<Article> findRandomArticle(final int size) {
        return articleDao.findRandomArticle(size);
    }

    @Override
    public List<Article> findall() {
        return articleDao.findAll();
    }

    /**
     * 查找某 tagId 下的所有文章（分页）
     */
    @Override
    public Page<Article> findByTagIdAndInPage(PageHandler pageHandler, final String tagId) {
        return articleDao.findByTagIdAndInPage(pageHandler,tagId);
    }
}
