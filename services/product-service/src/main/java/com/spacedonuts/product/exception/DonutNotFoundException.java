
package com.spacedonuts.product.exception;

public class DonutNotFoundException extends RuntimeException {

  public DonutNotFoundException(Long id) {
    super("Donut with ID " + id + " was not found.");
  }
}
