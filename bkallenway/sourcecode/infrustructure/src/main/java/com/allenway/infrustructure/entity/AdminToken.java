package com.allenway.infrustructure.entity;

import com.allenway.commons.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by wuhuachuan on 16/7/11.
 */

//callSuper = true 表示 父类的toString 也会打印
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = false)
@Data
@Entity
@Table(name = "tb_admin_token")
@NoArgsConstructor
public class AdminToken extends BaseEntity{

    private String adminId;
    private String token;
    public AdminToken(String adminId,String token){
        this.adminId = adminId;
        this.token = token;
    }
}
