package com.allenway.visitor.entity;

import com.allenway.commons.entity.BaseEntity;
import com.google.gson.annotations.Expose;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;

/**
 * Created by wuhuachuan on 16/3/9.
 */

@ToString(callSuper = true)
@Data
@Entity
@Table(name = "tb_article")
@NoArgsConstructor
public class Article extends BaseEntity {

    private String title;
    private String content;
    private int readNum = 0;

    //article 和 classify 的联系
    private String classifyId;
    private transient String classifyName;

    //article 和 tag 的联系
    private transient List<Tag> tags;

    //article 和 comment 的联系
    private transient List<Comment> comments;
    private transient int commentNum;

    public Article(Builder buider){
        super.id = buider.id;
        this.title = buider.title;
        this.readNum = buider.readNum;
    }

    public static class Builder{
        private String id;
        private String title;
        private int readNum = 0;

        public Builder id(Object id){
            this.id = (String)id;
            return this;
        }
        public Builder title(Object title){
            this.title = (String)title;
            return this;
        }
        public Builder readNum(Object readNum){
            this.readNum = (int)readNum;
            return this;
        }
        public Article build(){
            return new Article(this);
        }
    }
}
