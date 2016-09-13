package com.allenway.commons.exception;

import com.allenway.commons.response.ReturnStatusCode;
import com.allenway.commons.response.ReturnTemplate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.io.IOException;


/**
 * Created by wuhuachuan on 16/3/29.
 */

@Slf4j
@ControllerAdvice
public class ExceptionHandlerBean extends ResponseEntityExceptionHandler {

    @ExceptionHandler({RuntimeException.class})
    public ResponseEntity<Object> handleRuntimeException(final RuntimeException ex,final WebRequest request) throws IOException {
        return getResponseEntity(ex,request, ReturnStatusCode.RuntimeException);
    }

    @ExceptionHandler({NullPointerException.class})
    public ResponseEntity<Object> handleNullPointerException(final RuntimeException ex,final WebRequest request) throws IOException {
        return getResponseEntity(ex,request, ReturnStatusCode.NullPointerException);
    }

    @ExceptionHandler({DataNotFoundException.class})
    public ResponseEntity<Object> handleDataNotFoundException(final RuntimeException ex,final WebRequest request) throws IOException {
        return getResponseEntity(ex,request,ReturnStatusCode.DataNotFoundException);
    }

    @ExceptionHandler({ IllegalArgumentException.class })
    public ResponseEntity<Object> handleIllegalArgumentException(final RuntimeException ex,final WebRequest request) throws IOException {
        return getResponseEntity(ex,request, ReturnStatusCode.IllegalArgumentException);
    }

    @ExceptionHandler({UserLogoutException.class})
    public ResponseEntity<Object> userLogoutException(final RuntimeException ex,final WebRequest request) throws IOException {
        return getResponseEntity(ex,request, ReturnStatusCode.USER_HAS_LOGOUT);
    }

    @ExceptionHandler({OperationFailException.class})
    public ResponseEntity<Object> handleOperationFailException(final RuntimeException ex,final WebRequest request) throws IOException {
        return getResponseEntity(ex,request,ReturnStatusCode.OPERATION_FAIL);
    }

    /**
     * 根据各种异常构建 ResponseEntity 实体. 服务于以上各种异常
     */
    private ResponseEntity<Object> getResponseEntity(final RuntimeException ex,
                                                     final WebRequest request,
                                                     final ReturnStatusCode specificException) {
        ReturnTemplate returnTemplate = new ReturnTemplate(specificException,ex.getMessage());

        log.error(ex.toString());
        StackTraceElement[] trace = ex.getStackTrace();
        for (StackTraceElement traceElement : trace)
            log.error("\tat " + traceElement);

        return handleExceptionInternal(ex, returnTemplate, new HttpHeaders(), HttpStatus.OK, request);
    }
}
