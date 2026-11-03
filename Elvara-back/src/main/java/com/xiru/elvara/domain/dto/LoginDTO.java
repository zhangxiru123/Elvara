package com.xiru.elvara.domain.dto;

import lombok.Data;

@Data
public class LoginDTO {
    //账户(邮箱或用户名)
    private String account;

    //密码
    private String password;
}
