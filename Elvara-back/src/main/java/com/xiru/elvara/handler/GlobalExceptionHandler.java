package com.xiru.elvara.handler;

import com.xiru.elvara.exception.BaseException;
import com.xiru.elvara.result.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.sql.SQLIntegrityConstraintViolationException;

/**
 * 全局异常处理器
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    //捕获业务异常
    @ExceptionHandler(BaseException.class)
    public Result exceptionHandler(BaseException ex){
        log.warn("异常信息:{}",ex.getMessage());
        return Result.error(ex.getMessage());
    }

    @ExceptionHandler
    public Result exceptionHandler(SQLIntegrityConstraintViolationException ex){
        String message = ex.getMessage();
        //检测异常是否由重复引起
        if(message.contains("Duplicate entry")){
            //截取重复字段
            String[] split = message.split(" ");
            String duplicate = split[2];
            String msg = duplicate+ "已被注册";
            return  Result.error(msg);
        }else{
            //不是由重复引起,未知异常
            return Result.error("未知异常,请联系管理员!");
        }
    }
}
