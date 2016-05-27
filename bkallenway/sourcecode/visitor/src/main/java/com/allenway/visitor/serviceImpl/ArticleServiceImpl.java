package com.allenway.visitor.serviceImpl;

import com.allenway.visitor.dao.ArticleDao;
import com.allenway.visitor.dao.ExtendCrudDao;
import com.allenway.visitor.entity.Article;
import com.allenway.visitor.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by wuhuachuan on 16/3/9.
 */

@Service
public class ArticleServiceImpl implements ArticleService {

    @Autowired
    private ArticleDao articleDao;

//    @Autowired
//    private ExtendCrudDao extendCrudDao;

    @Override
    public Article saveArticle(Article article) {
        return articleDao.saveAndFlush(article);
    }

    @Override
    public void deleteArticle(Article article) {
        article.setIsDelete(true);
        articleDao.save(article);
    }

    @Override
    public Article findArticleById(String id) {
        return articleDao.findArticleByIdAndIsDelete(id,false);
    }

    @Override
    public List<Article> findAllArticles() {
        return articleDao.findAllArticles();
    }

    @Override
    public List<Article> findArticlesByTagId(String tagId) {
        return articleDao.findArticleByTagId(tagId);
    }

    @Override
    public Article findRandomArticle() {
//        return (Article) extendCrudDao.findRandomArticle();
        return articleDao.findRandomArticle();

    }
}
