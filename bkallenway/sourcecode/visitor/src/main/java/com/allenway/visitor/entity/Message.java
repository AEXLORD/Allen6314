package com.allenway.visitor.entity;

import com.allenway.commons.entity.BaseEntity;
import com.allenway.infrustructure.entity.Record;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by wuhuachuan on 16/6/3.
 * 用户的留言
 */

@ToString(callSuper = true)
@Data
@Entity
@Table(name = "tb_message")
@NoArgsConstructor
public class Message extends BaseEntity{

    private String userId; //哪个用户留言
    private String content;
    private int floor; //几楼

    public Message(Builder builder){
        this.userId = builder.userId;
        this.content = builder.content;
        this.floor = builder.floor;
    }

    public static class Builder {
        private String userId; //哪个用户留言
        private String content;
        private int floor; //几楼

        public Builder userId(String userId){
            this.userId = userId;
            return this;
        }
        public Builder content(String content){
            this.content = content;
            return this;
        }
        public Builder floor(int floor){
            this.floor = floor;
            return this;
        }
        public Message build(){
            return new Message(this);
        }
    }
}
