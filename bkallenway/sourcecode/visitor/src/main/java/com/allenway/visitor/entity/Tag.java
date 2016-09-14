package com.allenway.visitor.entity;

import com.allenway.commons.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by wuhuachuan on 16/4/2.
 */

@Entity
@Table(name = "tb_tag")
@EqualsAndHashCode(callSuper = true)
@Data
@ToString(callSuper = true)
@NoArgsConstructor
public class Tag extends BaseEntity {

    private String name;
    private String moduleId;
    private int articleNum;

    public Tag(final String name,final String moduleId){
        this.name = name;
        this.moduleId = moduleId;
    }
}
