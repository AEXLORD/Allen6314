package com.allenway.commons.dbconverter;

/**
 * <p>Description:</p>
 *  @author xyshmily
 *  @date 2015年12月29日 下午6:47:00
 */

import lombok.extern.slf4j.Slf4j;
import org.joda.time.LocalDateTime;

import javax.persistence.AttributeConverter;
import java.sql.Timestamp;

@Slf4j
public class LocalDateTimeTimestampConverter implements AttributeConverter<LocalDateTime,Timestamp> {
	@Override
	public Timestamp convertToDatabaseColumn(final LocalDateTime attribute) {
		return attribute == null ? null : new Timestamp(attribute.toDateTime().getMillis());
	}

	@Override
	public LocalDateTime convertToEntityAttribute(final Timestamp ts) {
		if (ts != null) {
            try {
                return LocalDateTime.fromDateFields(ts);
            } catch (IllegalArgumentException ex) {
                log.warn("Can't convert {} to LocalDate", ts, ex);
            }
        }
        return null;
	}
}
