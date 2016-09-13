package com.allenway.utils.encryption;


import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;

/**
 * Created by wuhuachuan on 16/3/8.
 */
public class DESEncryptUtil {

    private DESEncryptUtil(){}

    private static final String ADMINSALT = "97952b3e-ac0b-454c-b280-9832e0f7377d";

    /**
     * 验证用户名密码
     * @param passphrase : DB 经过加密的 密码
     * @param salt : ADMINSALT 和 identity 生成的 salt
     * @param userPassword : 需要验证的密码
     * @return true:密码正确  false:密码错误
     */
    public static boolean matchPassphrase(final String passphrase, final String salt, final String userPassword) {
        return passphrase.equalsIgnoreCase(getPassphrase(salt, userPassword));
    }

    /**
     * 利用代码的 ADMINSALT 和 identity 生成一个新的 salt
     * @return  存DB库,作为用户保存的 salt
     */
    public static String getSalt(final String identity) {
        return Base64.encodeBase64String(blend(ADMINSALT.getBytes(), identity.getBytes()));
    }

    /**
     * 对密码使用 salt 进行加密
     */
    public static String getPassphrase(final String salt, final String userPassword) {
        return DigestUtils.sha1Hex(blend(salt.getBytes(), userPassword.getBytes()));
    }

    private static byte[] blend(byte[] a, byte[] b) {
        byte[] result = new byte[a.length + b.length];
        int ai = 0;
        int bi = 0;
        for (int i = 0; i < result.length; i++) {
            if (ai == a.length || bi < ai && bi < b.length) {
                result[i] = b[bi++];
                continue;
            }
            if (bi == b.length || ai <= bi) {
                result[i] = a[ai++];
                continue;
            }
        }
        return result;
    }
}
