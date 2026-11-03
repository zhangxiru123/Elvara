package com.xiru.elvara.controller;

import cn.hutool.captcha.CaptchaUtil;
import cn.hutool.captcha.CircleCaptcha;
import com.xiru.elvara.domain.vo.CaptchaVO;
import com.xiru.elvara.result.Result;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/captcha")
public class CaptchaController {
    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @GetMapping
    public Result getCaptcha(HttpServletResponse response){
        //创建图形验证码
        CircleCaptcha captcha = CaptchaUtil.createCircleCaptcha(100, 40, 4, 20);
        String code = captcha.getCode();
        //生成唯一的key
        String captchaKey = UUID.randomUUID().toString();

        //存入redis,有效期两分钟
        stringRedisTemplate.opsForValue().set("login:captcha:"+captchaKey,code,2, TimeUnit.MINUTES);

        String imageBase64 = captcha.getImageBase64();

        CaptchaVO captchaVO = new CaptchaVO();
        captchaVO.setImage(imageBase64);
        captchaVO.setCaptchaKey(captchaKey);


        return Result.success(captchaVO);
    }
}