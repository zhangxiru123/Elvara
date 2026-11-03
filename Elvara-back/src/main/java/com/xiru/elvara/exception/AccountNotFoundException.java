package com.xiru.elvara.exception;

/**
 * 两次密码不一致异常
 */
public class AccountNotFoundException extends BaseException {
    public AccountNotFoundException(String message) {
        super(message);
    }
}
