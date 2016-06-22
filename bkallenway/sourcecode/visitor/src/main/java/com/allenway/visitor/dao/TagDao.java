package com.allenway.visitor.dao;

import com.allenway.visitor.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


/**
 * Created by wuhuachuan on 16/4/2.
 */
public interface TagDao extends JpaRepository<Tag, String> {

    @Query("select tag from Tag tag where isDelete = :isDelete order by type asc")
    List<Tag> findTagByIsDelete(@Param("isDelete") String isDelete);

    Tag findTagByIdAndIsDelete(String tagId,String isDelete);
    Tag findTagByNameAndIsDelete(String tagName, String isDelete);

    /**
     * 得到该tag 下的文章数量
     * @param tagId
     * @return
     */
    @Query(value = "select count(id) from tb_article where is_delete='0' and tag_id=:tagId",nativeQuery = true)
    int getArticleSumNumByTag(@Param("tagId")String tagId);

    List<Tag> findTagByModuleIdAndIsDelete(String moduleId, String isDelete);


}
