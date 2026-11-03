package com.xiru.elvara.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.lang.Validator;
import cn.hutool.crypto.digest.DigestUtil;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xiru.elvara.domain.dto.LoginDTO;
import com.xiru.elvara.domain.dto.RegisterDTO;
import com.xiru.elvara.domain.entity.User;
import com.xiru.elvara.domain.vo.LoginOrRegisterVO;
import com.xiru.elvara.exception.AccountNotFoundException;
import com.xiru.elvara.exception.BaseException;
import com.xiru.elvara.exception.PasswordNotSameException;
import com.xiru.elvara.properties.JwtProperties;
import com.xiru.elvara.result.Result;
import com.xiru.elvara.service.UserService;
import com.xiru.elvara.mapper.UserMapper;
import com.xiru.elvara.utils.JwtUtil;
import jakarta.annotation.Resource;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
* @author 29446
* @description 针对表【user(用户信息表)】的数据库操作Service实现
* @createDate 2026-11-02 19:57:26
*/
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User>
    implements UserService{

    @Resource
    private JwtProperties jwtProperties;
    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Override
    @Transactional
    public LoginOrRegisterVO register(RegisterDTO registerDTO) {
        //1.进行必要检验
        //1.1.判断两次输入密码是否一致
        if(! registerDTO.getPassword().equals(registerDTO.getConfirmPassword())){
            throw new PasswordNotSameException("两次密码不一致!");
        }
        //1.2.检验输入的邮箱是否规范
        boolean isEmail = Validator.isEmail(registerDTO.getEmail());
        if(!isEmail){
            throw new BaseException("邮箱格式不对,请重新输入");
        }
        //1.3.校验验证码
        String captchaKey = registerDTO.getCaptchaKey();
        String code = stringRedisTemplate.opsForValue().get("login:captcha:"+captchaKey);
        if(code==null){
            throw new BaseException("验证码已过期!");
        }
        if(!code.equalsIgnoreCase(registerDTO.getCaptchaCode())){
            stringRedisTemplate.delete("login:captcha:"+captchaKey);
            throw new BaseException("验证码输入有误!");
        }
        //2.将user对象存入数据库
        User user = BeanUtil.copyProperties(registerDTO, User.class);
        //2.1.密码加密
        String bcrypt = DigestUtil.bcrypt(user.getPassword());
        user.setPassword(bcrypt);
        //2.2.设置默认值,存入数据库
        user.setJoinType(1);
        user.setIcon("默认");
        user.setStatus(0);
        if(user.getNickName()==null){
            user.setNickName("用户"+ UUID.randomUUID());
        }
        user.setPersonalSignature("无");
        boolean isSuccess = save(user);
        if(!isSuccess){
            throw new BaseException("写入数据库异常");
        }
        //3.生成jwt的token
        Map<String,Object> claims = new HashMap<>();
        claims.put("userId",user.getId());
        String token = JwtUtil.createJwt(
                jwtProperties.getSecretKey(),
                jwtProperties.getTtl(),
                claims);
        user.setPassword("***********");
        //4.生成前端返回对象
        LoginOrRegisterVO registerVO = LoginOrRegisterVO.builder()
                .user(user)
                .token(token)
                .build();
        return registerVO;
    }

    @Override
    public LoginOrRegisterVO login(LoginDTO loginDTO) {
        if(loginDTO==null){
            return null;
        }
        String account = loginDTO.getAccount();
        //查询用户是否存在
        User user = getOne(Wrappers.lambdaQuery(User.class)
                .eq(account != null, User::getEmail, account)
                .or()
                .eq(account != null, User::getUsername, account));
        if(user==null){
            throw new AccountNotFoundException("账户不存在!");
        }
        //核实密码是否正确
        String password = loginDTO.getPassword();
        if(password ==null){
            throw new BaseException("密码不能为空!");
        }

        if(!DigestUtil.bcryptCheck(password,user.getPassword())){
            throw new BaseException("密码错误!");
        }
        user.setPassword("*********");
        //生成jwt的token
        Map<String,Object> claims = new HashMap<>();
        claims.put("userId",user.getId());
        String token = JwtUtil.createJwt(
                jwtProperties.getSecretKey(),
                jwtProperties.getTtl(),
                claims);

        //生成vo
        LoginOrRegisterVO loginVO = new LoginOrRegisterVO();
        loginVO.setUser(user);
        loginVO.setToken(token);

        return loginVO;

    }
}




