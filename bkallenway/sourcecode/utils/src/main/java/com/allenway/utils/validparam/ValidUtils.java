package com.allenway.utils.validparam;

import org.springframework.util.StringUtils;

/**
 * Created by wuhuachuan on 16/3/9.
 */

//abstract 防止实例化
public abstract class ValidUtils {

    /**
     * 检测 id 是否合理
     * @param id
     * @return true:参数合法 ; false:参数非法
     */
    public static boolean validIdParam(String id) {
        if(StringUtils.isEmpty(id)){
            return false;
            //防止 sql 攻击
        } else if(id.contains("\"") || id.contains("\'")){
            return false;
        } else {
            return true;
        }
    }
}
