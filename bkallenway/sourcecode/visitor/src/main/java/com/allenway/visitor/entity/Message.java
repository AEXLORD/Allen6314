package com.allenway.visitor.entity;

import com.allenway.commons.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Message : 留言板的留言 （不是文章评论,文章评论为 Comment 类）
 *
 * @author wuhuachuan712@163.com
 * @date 16/9/14
 */

@Entity
@Table(name = "tb_message")
@EqualsAndHashCode(callSuper = true)
@Data
@ToString(callSuper = true)
@NoArgsConstructor
public class Message extends BaseEntity {
}
