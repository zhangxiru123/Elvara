package com.xiru.elvara.interceptor;

import com.xiru.elvara.Context.BaseContext;
import com.xiru.elvara.properties.JwtProperties;
import com.xiru.elvara.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@Slf4j
public class JwtTokenInterceptor implements HandlerInterceptor {
    @Resource
    private JwtProperties jwtProperties;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //判断当前拦截的是Controller的方法还是其他资源
        if(!(handler instanceof HandlerMethod)){
            //不是,直接放行
            return true;
        }

        try {
            //jwt校验
            String token = request.getHeader(jwtProperties.getTokenName());

            log.info("jwt校验:{}",token);
            Claims claims = JwtUtil.parseJWT(jwtProperties.getSecretKey(), token);
            Long userId = Long.valueOf(claims.get("userId").toString());
            log.info("当前用户id:{}",userId);
            BaseContext.setCurrentId(userId);
            return true;
        } catch (NumberFormatException e) {
            //jwt校验不通过,响应401状态码
            response.setStatus(401);
            return false;
        }
    }
}