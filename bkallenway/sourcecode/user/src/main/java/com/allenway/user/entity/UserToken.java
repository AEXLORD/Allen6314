package com.allenway.user.entity;

import com.allenway.commons.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by wuhuachuan on 16/6/29.
 */

//callSuper = true 表示 父类的toString 也会打印
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = false)
@Data
@Entity
@Table(name = "tb_user_token")
@NoArgsConstructor
public class UserToken extends BaseEntity{
    private String userId;
    private String token;
    public UserToken(String userId,String token){
        this.userId = userId;
        this.token = token;
    }
}
