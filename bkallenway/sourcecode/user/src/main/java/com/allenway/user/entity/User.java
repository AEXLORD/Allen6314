package com.allenway.user.entity;

import com.allenway.commons.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by wuhuachuan on 16/6/26.
 */

//callSuper = true 表示 父类的toString 也会打印
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = false)
@Data
@Entity
@Table(name = "tb_user")
@NoArgsConstructor
public class User extends BaseEntity{
    private String username;
    private String password;
    private String salt;

    private String email;
    private String phone;

    private String isVip = "0"; // "1":是 ; "0":不是

    public User(String username, String passPhrase) {
        this.username = username;
        this.password = passPhrase;
    }
}
