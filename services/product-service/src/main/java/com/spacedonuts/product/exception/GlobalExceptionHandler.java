
package com.spacedonuts.product.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(DonutNotFoundException.class)
  public ProblemDetail handleDonutNotFound(
    DonutNotFoundException exception) {

    ProblemDetail problem = ProblemDetail.forStatusAndDetail(
      HttpStatus.NOT_FOUND,
      exception.getMessage()
    );

    problem.setTitle("Donut not found");

    return problem;
  }
}
