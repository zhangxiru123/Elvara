package com.xiru.elvara.domain.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Builder;
import lombok.Data;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName(value = "user")
public class User implements Serializable{
    //主键ID
    @TableId(value = "id",type = IdType.AUTO)
    private Long id;

    //用户名
    private String username;

    //密码
    private String password;

    //邮箱
    private String email;

    //昵称
    private String nickName;

    //性别 0:女 1:男
    private Integer sex;

    //头像
    private String icon;

    //加好友方式 0:自动同意 1:需用户自己同意
    private Integer joinType;

    //个性签名
    private String personalSignature;

    //账户状态
    private Integer status;

    //创建时间
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    //地区名称
    private String areaName;

    //地区编号
    private Integer areaCode;

    //最后登录时间
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastLoginTime;

    //最近下线时间
    private String lastOffTime;
}
