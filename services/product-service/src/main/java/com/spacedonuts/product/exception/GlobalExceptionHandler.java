
package com.spacedonuts.product.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  private static final Logger log =
    LoggerFactory.getLogger(GlobalExceptionHandler.class);

  @ExceptionHandler(ProductNotFoundException.class)
  public ProblemDetail handleDonutNotFound(
    ProductNotFoundException exception) {

    log.warn("Product not found: {}", exception.getMessage());

    ProblemDetail problem = ProblemDetail.forStatusAndDetail(
      HttpStatus.NOT_FOUND,
      exception.getMessage()
    );

    problem.setTitle("Product not found");

    return problem;
  }

  @ExceptionHandler(Exception.class)
  public ProblemDetail handleUnexpectedException(Exception exception) {

    log.error("An unexpected error occurred", exception);

    ProblemDetail problem = ProblemDetail.forStatusAndDetail(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "An unexpected error occurred."
    );

    problem.setTitle("Internal Server Error");

    return problem;
  }
}
