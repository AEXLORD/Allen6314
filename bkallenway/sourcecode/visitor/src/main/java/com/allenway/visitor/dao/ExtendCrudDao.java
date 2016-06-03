package com.allenway.visitor.dao;

import com.allenway.visitor.entity.Article;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

/**
 * Created by wuhuachuan on 16/5/27.
 */

//@Service
public class ExtendCrudDao {

    @PersistenceContext
    private EntityManager em;

    public void test() {
        String SQL = "select article from Article article";
        TypedQuery query = em.createQuery(SQL, Article.class);
        query.setMaxResults(1);
        Article article = (Article) query.getSingleResult();
    }
}
