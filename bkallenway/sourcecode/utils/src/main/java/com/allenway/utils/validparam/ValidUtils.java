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
    /**
     * 分页查询的时候,验证 Page 和 Size 是否合理
     * 1. page,size 不能为空
     * 2. page,size 都是大于0 的数.
     * 3. size 每页的大小不能超过 15
     * @return
     */
    public static boolean validPageAndSize(String page,String size) {
        if(StringUtils.isEmpty(page) || StringUtils.isEmpty(size)){
            return false;
        } else if(Integer.parseInt(page) <= 0 || Integer.parseInt(size) <= 0){
            return false;
        } else if(Integer.parseInt(size) > 15){
            return false;
        } else {
            return true;
        }
    }
}
