package com.allenway.visitor.serviceImpl;

import com.allenway.visitor.dao.ArticleDao;
import com.allenway.visitor.entity.Article;
import com.allenway.visitor.service.ArticleService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;

/**
 * Created by wuhuachuan on 16/3/9.
 */

@Service
@Slf4j
public class ArticleServiceImpl implements ArticleService {

    @Autowired
    private ArticleDao articleDao;

//    @Autowired
//    private ExtendCrudDao extendCrudDao;

    @Override
    @CacheEvict(value = "article",keyGenerator = "article_id")
    public Article saveArticle(Article article) {
        return articleDao.saveAndFlush(article);
    }

    @Override
    @CacheEvict(value = "article",keyGenerator = "article_id")
    public void deleteArticle(Article article) {
        article.setIsDelete("1");
        articleDao.save(article);
    }

    @Override
    public Article findArticleById(String id) {
        return articleDao.findArticleById(id);
    }

    /**
     * page: 需要第几页的数据
     * size: 每页有多少数据
     */
    @Override
    public List<Article> findArticlesByTagId(String tagId,String page,String size) {

        int _page = Integer.parseInt(page);
        int _size = Integer.parseInt(size);

        return getPageArticles(articleDao.findArticleByTagId(tagId),_page,_size);
    }

    /**
     * page: 需要第几页的数据
     * size: 每页有多少数据
     */
    @Override
    public List<Article> findArticlesByModuleId(String moduleId,String page,String size) {

        int _page = Integer.parseInt(page);
        int _size = Integer.parseInt(size);

        return getPageArticles(articleDao.findArticleByModuleId(moduleId),_page,_size);
    }

    private List<Article> getPageArticles(List<Article> articleWithOutPage, int page, int size) {
        List<Article> articleWithPage  = new LinkedList<Article>();

        //总共有多少页
        int totalPages = (int) Math.ceil((float)articleWithOutPage.size() / size);

        if(page > totalPages || page <= 0){
            return null;
        } else if(totalPages == 1){
            return articleWithOutPage;
        } else {
            int begin = (page - 1) * size ;
            int end;

            if( (articleWithOutPage.size() - begin) < size){
                end = articleWithOutPage.size();
            } else {
                end = begin + size;
            }

            for (int i = begin; i < end; i++) {
                articleWithPage.add(articleWithOutPage.get(i));
            }
            return articleWithPage;
        }
    }

    @Override
    public Article findRandomArticle() {
//        return (Article) extendCrudDao.findRandomArticle();
        return articleDao.findRandomArticle();
    }

    @Override
    public int sumArticleByModuleId(String moduleId) {
        return articleDao.sumArticlesByModuleId(moduleId);
    }

    @Override
    public int sumArticleByTagId(String tagId) {
        return articleDao.sumArticlesByTagId(tagId);
    }

}
