package com.xiru.elvara.domain.vo;

import com.xiru.elvara.domain.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginOrRegisterVO {
    //jwt的token
    private String token;

    private User user;
}
