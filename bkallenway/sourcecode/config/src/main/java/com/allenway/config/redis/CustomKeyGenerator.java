package com.allenway.config.redis;

import com.allenway.visitor.entity.Article;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.lang.reflect.Method;

/**
 * Created by wuhuachuan on 16/6/13.
 */

@Configuration
public class CustomKeyGenerator {

    /**
     * module 部分的 key
     */
    public final static String MODULE_ALLMODULE = "all_modules";

    /**
     * article 部分的 key
     */
    public final static String ARTICLE_PREFIX = "article:";
    public final static String ARTICLE_ID = ARTICLE_PREFIX + "articleid:";




    /**
     * module 部分的 key
     * @return
     */
    @Bean
    public KeyGenerator all_module(){
        return new KeyGenerator() {
            @Override
            public Object generate(Object target, Method method, Object... params) {
                return MODULE_ALLMODULE;
            }
        };
    }

    /**
     * article 部分的 key
     * @return
     */
    @Bean
    public KeyGenerator article_id(){
        return new KeyGenerator() {
            @Override
            public Object generate(Object target, Method method, Object... params) {
                if(params[0] instanceof String){
                    return ARTICLE_ID + params[0];
                } else if(params[0] instanceof Article){
                    return ARTICLE_ID + ((Article)params[0]).getId();
                } else {
                    return null;
                }
            }
        };
    }
}
