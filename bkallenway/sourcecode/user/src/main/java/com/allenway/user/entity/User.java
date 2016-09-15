package com.allenway.user.entity;

import com.allenway.commons.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * User :
 *
 * @author wuhuachuan712@163.com
 * @date 16/9/14
 */

@Entity
@Table(name = "tb_user")
@EqualsAndHashCode(callSuper = true)
@Data
@ToString(callSuper = true)
@NoArgsConstructor
public class User extends BaseEntity{

    private String username;

    private String password;

    private String salt;

    public User(final String username,
                final String password,
                final String salt){
        this.username = username;
        this.password = password;
        this.salt = salt;
    }
}
