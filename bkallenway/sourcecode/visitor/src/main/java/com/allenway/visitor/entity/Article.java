package com.allenway.visitor.entity;

import com.allenway.commons.entity.BaseEntity;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by wuhuachuan on 16/3/9.
 */

@ToString(callSuper = true)
@Data
@Entity
@Table(name = "tb_article")
@NoArgsConstructor
public class Article extends BaseEntity {

    private String title;  //标题
    private String content;   //内容
    private int readNum = 0;  //阅读量
    private String tagId;   //所属 tag
    private String moduleId; //所属于module
    private String moduleName;
    private String isTop = "0"; //是否置顶

    private int up = 0;  //赞
    private int down = 0; //踩
}
