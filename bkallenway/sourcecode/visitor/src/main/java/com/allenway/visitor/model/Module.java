package com.allenway.visitor.model;

import com.allenway.commons.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by wuhuachuan on 16/5/30.
 */

@Entity
@Table(name = "tb_module")
@EqualsAndHashCode(callSuper = true)
@Data
@ToString(callSuper = true)
@NoArgsConstructor
public class Module extends BaseEntity{

    private String name;

    public Module(final String name){
        this.name = name;
    }
}
