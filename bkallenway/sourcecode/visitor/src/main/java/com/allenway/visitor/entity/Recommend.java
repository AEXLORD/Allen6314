package com.allenway.visitor.entity;

import com.allenway.commons.entity.BaseEntity;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by wuhuachuan on 16/6/20.
 */

@ToString(callSuper = true)
@Data
@Entity
@Table(name = "tb_recommend")
@NoArgsConstructor
public class Recommend extends BaseEntity{
    private String profile;   //文字简介
    private String link;   //链接
    private String imgPath;   // 图片
    private String classify;  //所属 分类
    private String other;   //其他备用,例如 Recommend 的二级分类
}
