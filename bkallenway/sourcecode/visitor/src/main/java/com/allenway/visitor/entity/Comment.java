package com.allenway.visitor.entity;

import com.allenway.commons.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Comment : 文章评论 （不是留言板的留言,留言板的留言为 Message 类）
 *
 * @author wuhuachuan712@163.com
 * @date 16/9/14
 */

@Entity
@Table(name = "tb_comment")
@EqualsAndHashCode(callSuper = true)
@Data
@ToString(callSuper = true)
@NoArgsConstructor
public class Comment extends BaseEntity{

    /**
     * 用户名
     */
    private String username;

    /**
     * 回复哪一篇文章
     */
    private String articleId;

    /**
     * 评论内容
     */
    private String content;

    /**
     * 回复给谁（如果是条回复评论的话）
     */
    private String replyTo;

    public Comment(final String username,
                   final String articleId,
                   final String content){
        this.username = username;
        this.articleId = articleId;
        this.content = content;
    }
}
