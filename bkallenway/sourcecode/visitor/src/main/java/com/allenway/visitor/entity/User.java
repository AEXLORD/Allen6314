package com.allenway.visitor.entity;

import com.allenway.commons.entity.BaseEntity;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by wuhuachuan on 16/5/31.
 */

@ToString(callSuper = true)
@Data
@Entity
@Table(name = "tb_user")
@NoArgsConstructor
public class User extends BaseEntity{

    private String username;
    private String password;

    private String email;
}
