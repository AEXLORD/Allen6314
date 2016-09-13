package com.allenway.commons.entity;

import com.allenway.commons.dbconverter.CustomLocalDateTimeDeserializer;
import com.allenway.commons.dbconverter.CustomLocalDateTimeSerializer;
import com.allenway.commons.dbconverter.LocalDateTimeTimestampConverter;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;
import lombok.ToString;
import org.hibernate.annotations.GenericGenerator;
import org.joda.time.LocalDateTime;

import javax.persistence.Convert;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

/**
 * Created by wuhuachuan on 16/3/3.
 */

@MappedSuperclass
@Data
@ToString
public class BaseEntity {

    @Id
    @GeneratedValue(generator = "systemUUID")
    @GenericGenerator(name="systemUUID",strategy="uuid2")
    protected String id;

    /**
     * 操作时间
     */
    @JsonSerialize(using=CustomLocalDateTimeSerializer.class)
    @JsonDeserialize(using=CustomLocalDateTimeDeserializer.class)
    @Convert(converter=LocalDateTimeTimestampConverter.class)
    private LocalDateTime operationTime;

    /**
     *  true:已删除  false:未删除
     */
    private boolean isDelete = false;
}
