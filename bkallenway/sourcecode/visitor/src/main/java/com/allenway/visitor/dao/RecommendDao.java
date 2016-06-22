package com.allenway.visitor.dao;

import com.allenway.visitor.entity.Recommend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Set;

/**
 * Created by wuhuachuan on 16/6/20.
 */
public interface RecommendDao  extends JpaRepository<Recommend,String> {

    @Query("select recommend from Recommend recommend where isDelete = :isDelete and classify = :classify order by other asc")
    Set<Recommend> findRecommendByClassifyAndIsDelete(@Param("classify")String classfy,@Param("isDelete")String isDelete);

    @Query("select recommend from Recommend recommend where isDelete = :isDelete order by other asc")
    Set<Recommend> findRecommendByIsDelete(@Param("isDelete") String isDelete);
}
