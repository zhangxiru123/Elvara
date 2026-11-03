package com.xiru.elvara.controller;

import com.xiru.elvara.domain.dto.LoginDTO;
import com.xiru.elvara.domain.dto.RegisterDTO;
import com.xiru.elvara.domain.vo.LoginOrRegisterVO;
import com.xiru.elvara.result.Result;
import com.xiru.elvara.service.UserService;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@Slf4j
public class UserController {
    @Resource
    private UserService userService;

    /**
     * 用户注册
     * @param registerDTO
     * @return
     */
    @PostMapping("/register")
    public Result<LoginOrRegisterVO> register(@RequestBody RegisterDTO registerDTO){
        log.info("用户注册");
        LoginOrRegisterVO registerVO=userService.register(registerDTO);
        return Result.success(registerVO);
    }

    @PostMapping("/login")
    public Result<LoginOrRegisterVO> login(@RequestBody LoginDTO loginDTO){
        log.info("用户登录");
        LoginOrRegisterVO loginVO=userService.login(loginDTO);
        return Result.success(loginVO);
    }
}