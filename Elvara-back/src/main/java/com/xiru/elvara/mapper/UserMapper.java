package com.xiru.elvara.mapper;

import com.xiru.elvara.domain.entity.User;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
* @author 29446
* @description 针对表【user(用户信息表)】的数据库操作Mapper
* @createDate 2026-11-02 19:57:26
* @Entity generator.domain.User
*/
@Mapper
public interface UserMapper extends BaseMapper<User> {

}




