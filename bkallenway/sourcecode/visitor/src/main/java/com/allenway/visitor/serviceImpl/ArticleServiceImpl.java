package com.allenway.visitor.serviceImpl;

import com.allenway.visitor.dao.ArticleDao;
import com.allenway.visitor.entity.Article;
import com.allenway.visitor.entity.Article_Tag;
import com.allenway.visitor.service.ArticleService;
import com.allenway.visitor.service.Article_TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Predicate;
import org.springframework.data.domain.Pageable;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.persistence.criteria.CriteriaBuilder;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by wuhuachuan on 16/3/9.
 */

@Service
public class ArticleServiceImpl implements ArticleService {

    @Autowired
    private ArticleDao articleDao;

    @Autowired
    private Article_TagService article_tagService;

    @Override
    public Article save(Article article) {
        return articleDao.saveAndFlush(article);
    }

    @Override
    public Article findArticleById(String id) {
        return articleDao.findArticleById(id);
    }

    @Override
    public void delete(Article article) {
        article.setIsDelete(true);
        articleDao.saveAndFlush(article);
    }

    @Override
    public List<Article> findArticlesByClassifyId(String id) {
        return articleDao.findArticlesByClassifyId(id);
    }

    @Override
    public List<Article> findAllArticles() {

        List<Object[]> objs = articleDao.findAllArticles();
        List<Article> articles = new LinkedList<Article>();

        objs
            .parallelStream()
            .forEach(param ->{
                articles.add(new Article
                                    .Builder()
                                    .id(param[0])
                                    .title(param[1])
                                    .readNum(param[2])
                                    .build());
            });

        return articles;
    }

    @Override
    public List<Article> findRecommendArticles() {

//        CriteriaBuilder criteriaBuilder = new CriteriaBuilder().
//
//        QueryDslPredicateExecutor.findAll(Predicate predicate, Pageable pageable);
//        return articleDao.findRecommendArticles();
        return null;
    }

    @Override
    public List<Article> findArticlesByTagId(String tagId) {

        //根据该 Tag 找出全部 article-tag 关系
        List<Article_Tag> article_tags = article_tagService.findByTagId(tagId);

        //根据 article-tag 找出全部的 article.
        List<Article> articles = new LinkedList<Article>();

        article_tags.parallelStream().forEach(param -> {
            Article article = findArticleById(param.getArticleId());
            articles.add(article);
        });
        return articles;
    }
}
