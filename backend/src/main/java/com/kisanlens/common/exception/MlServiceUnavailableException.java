package com.kisanlens.common.exception;

public class MlServiceUnavailableException extends RuntimeException {
    public MlServiceUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }

    public MlServiceUnavailableException(String message) {
        super(message);
    }
}
