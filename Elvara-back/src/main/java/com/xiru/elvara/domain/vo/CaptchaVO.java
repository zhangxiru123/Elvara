package com.xiru.elvara.domain.vo;

import lombok.Data;

@Data
public class CaptchaVO {
    //图片
    private String image;

    //验证码key
    private String captchaKey;
}
