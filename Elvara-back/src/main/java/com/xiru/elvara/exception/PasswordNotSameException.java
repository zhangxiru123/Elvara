package com.xiru.elvara.exception;

/**
 * 两次密码不一致异常
 */
public class PasswordNotSameException extends BaseException {
    public PasswordNotSameException(String message) {
        super(message);
    }
}
