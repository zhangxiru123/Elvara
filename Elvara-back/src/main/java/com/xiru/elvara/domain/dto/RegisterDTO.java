package com.xiru.elvara.domain.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class RegisterDTO implements Serializable {
    //用户名
    private String username;

    //密码
    private String password;

    //二次输入密码
    private String confirmPassword;

    //邮箱
    private String email;

    //昵称
    private String nickName;

    //性别
    private Integer sex;

    //地区
    private String areaName;

    //地区编号
    private Integer areaCode;

    //验证码key
    private String captchaKey;

    //验证码
    private String captchaCode;
}
