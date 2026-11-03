package com.xiru.elvara.utils;



import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Jwts;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

public class JwtUtil {
    /**
     * 生成jwt
     * 使用Hs256算法, 私匙使用固定秘钥
     *
     * @param secretKey jwt秘钥
     * @param ttlMillis jwt过期时间(毫秒)
     * @param claims    设置的信息
     * @return
     */
    public static String createJwt(String secretKey, long ttlMillis, Map<String,Object> claims){
        //指定签名算法
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;

        //生成jwt时间
        long expMillis = System.currentTimeMillis() + ttlMillis;
        Date exp =new Date(expMillis);

        //设置jwt的body
        JwtBuilder builder = Jwts.builder()
                //赋值claim
                .setClaims(claims)
                //设置过期时间
                .setExpiration(exp)
                //设置签名算法以及密钥
                .signWith(signatureAlgorithm, secretKey.getBytes(StandardCharsets.UTF_8));
        return builder.compact();
    }

    /**
     * Token解密
     *
     * @param secretKey jwt秘钥 此秘钥一定要保留好在服务端, 不能暴露出去, 否则sign就可以被伪造, 如果对接多个客户端建议改造成多个
     * @param token     加密后的token
     * @return
     */
    public static Claims parseJWT(String secretKey,String token){
        // 得到DefaultJwtParser
        Claims claims = Jwts.parser()
                //设置解析的密钥
                .setSigningKey(secretKey)
                //需要解析的jwt
                .parseClaimsJws(token)
                .getBody();
        return claims;
    }

}