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

    public Object findRandomArticle(){
        String SQL = "select article from Article article order by rand() LIMIT 1";
        TypedQuery query = em.createQuery(SQL, Article.class);
        return query.getSingleResult();
    }
}
