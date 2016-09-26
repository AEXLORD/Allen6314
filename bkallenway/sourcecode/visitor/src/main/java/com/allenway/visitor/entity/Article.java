package com.allenway.visitor.entity;

import com.allenway.commons.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.util.List;

/**
 * Created by wuhuachuan on 16/3/9.
 */

@Entity
@Table(name = "tb_article")
@EqualsAndHashCode(callSuper = true)
@Data
@ToString(callSuper = true,exclude = "content")
@NoArgsConstructor
public class Article extends BaseEntity {
    private String title;
    private String content;
    private String tagId;
    private String moduleId;
    private boolean isTop = false;
    private int readNum = 0;
    private int up = 0;
    private int down = 0;

    @Transient
    private List<Comment> commentList;

    public Article(final String title,
                   final String content,
                   final String tagId){
        this.title =title;
        this.content = content;
        this.tagId = tagId;
    }
}
