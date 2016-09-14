package com.allenway.visitor.entity;

import com.allenway.commons.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Table;

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
    private boolean isTop = false;
    private int readNum = 0;
    private int up = 0;
    private int down = 0;
}
