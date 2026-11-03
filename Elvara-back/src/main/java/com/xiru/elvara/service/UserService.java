package com.xiru.elvara.service;

import com.xiru.elvara.domain.dto.LoginDTO;
import com.xiru.elvara.domain.dto.RegisterDTO;
import com.xiru.elvara.domain.entity.User;
import com.baomidou.mybatisplus.extension.service.IService;
import com.xiru.elvara.domain.vo.LoginOrRegisterVO;

/**
* @author 29446
* @description 针对表【user(用户信息表)】的数据库操作Service
* @createDate 2026-11-02 19:57:26
*/
public interface UserService extends IService<User> {

    /**
     * 用户注册
     * @param registerDTO
     * @return
     */
    LoginOrRegisterVO register(RegisterDTO registerDTO);

    /**
     * 用户登录
     * @param loginDTO
     * @return
     */
    LoginOrRegisterVO login(LoginDTO loginDTO);
}
