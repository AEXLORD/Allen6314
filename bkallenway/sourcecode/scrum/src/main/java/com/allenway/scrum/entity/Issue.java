package com.allenway.scrum.entity;

import com.allenway.commons.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by wuhuachuan on 16/7/1.
 */

//callSuper = true 表示 父类的toString 也会打印
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = false)
@Data
@Entity
@Table(name = "tb_issue")
@NoArgsConstructor
public class Issue extends BaseEntity {
    private String name;
    private String color;
    private String userId;
}
