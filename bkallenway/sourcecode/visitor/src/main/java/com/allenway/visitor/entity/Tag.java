package com.allenway.visitor.entity;

import com.allenway.commons.entity.BaseEntity;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by wuhuachuan on 16/4/2.
 */

@ToString(callSuper = true)
@Data
@Entity
@Table(name = "tb_tag")
@NoArgsConstructor
public class Tag extends BaseEntity {
    private String name;   //tag 名称
    private String moduleId; //每个 tag 都属于某一个 module
    private String moduleName;
    private String type;  //Learning 模块需要到,tag的类型,如 基础,框架,其他



    private transient int articleNum;
}
