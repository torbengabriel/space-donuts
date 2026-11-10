package com.spacedonuts.product;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ProductIntegrationTest extends AbstractIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Test
  void shouldGetDonutById() throws Exception {
    long donutId = createTestDonut();

    mockMvc.perform(get("/api/products/" + donutId))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.id").value(donutId))
      .andExpect(jsonPath("$.name").value("Integration Test Donut"))
      .andExpect(jsonPath("$.price").value(4.50));
  }

  @Test
  void shouldCreateDonut() throws Exception {

    String request = """
                {
                    "name": "Test Donut",
                    "description": "Integration Test Donut",
                    "price": 4.50,
                    "imageUrl": "/images/products/test-product.png",
                    "vegan": false
                }
                """;

    mockMvc.perform(post("/api/products")
        .contentType(MediaType.APPLICATION_JSON)
        .content(request))
      .andExpect(status().isCreated())
      .andExpect(header().exists("Location"))
      .andExpect(jsonPath("$.id").exists())
      .andExpect(jsonPath("$.name").value("Test Donut"))
      .andExpect(jsonPath("$.price").value(4.50));
  }

  @Test
  void shouldUpdateDonut() throws Exception {
    long donutId = createTestDonut();

    String request = """
            {
                "name": "Updated Donut",
                "description": "Updated description",
                "price": 5.50,
                "imageUrl": "/images/products/updated.png",
                "vegan": true
            }
            """;

    mockMvc.perform(put("/api/products/" + donutId)
        .contentType(MediaType.APPLICATION_JSON)
        .content(request))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.id").value(donutId))
      .andExpect(jsonPath("$.name").value("Updated Donut"))
      .andExpect(jsonPath("$.price").value(5.50))
      .andExpect(jsonPath("$.vegan").value(true));
  }

  @Test
  void shouldDeleteDonut() throws Exception {
    long donutId = createTestDonut();

    mockMvc.perform(delete("/api/products/" + donutId))
      .andExpect(status().isNoContent());

    mockMvc.perform(get("/api/products/" + donutId))
      .andExpect(status().isNotFound());
  }

  @Test
  void shouldRejectDonutWithoutName() throws Exception {
    String request = """
            {
                "description": "A product without a name",
                "price": 4.50,
                "imageUrl": "/images/products/test.png",
                "vegan": false
            }
            """;

    mockMvc.perform(post("/api/products")
        .contentType(MediaType.APPLICATION_JSON)
        .content(request))
      .andExpect(status().isBadRequest());
  }

  @Test
  void shouldRejectDonutWithNegativePrice() throws Exception {
    String request = """
            {
                "name": "Invalid Donut",
                "description": "Negative price",
                "price": -4.50,
                "imageUrl": "/images/products/test.png",
                "vegan": false
            }
            """;

    mockMvc.perform(post("/api/products")
        .contentType(MediaType.APPLICATION_JSON)
        .content(request))
      .andExpect(status().isBadRequest());
  }

  @Test
  void shouldReturn404WhenDonutDoesNotExist() throws Exception {
    mockMvc.perform(get("/api/products/999"))
      .andExpect(status().isNotFound())
      .andExpect(jsonPath("$.title").value("Product not found"));
  }

  private long createTestDonut() throws Exception {
    String request = """
            {
                "name": "Integration Test Donut",
                "description": "Created for testing",
                "price": 4.50,
                "imageUrl": "/images/products/test.png",
                "vegan": false
            }
            """;

    String response = mockMvc.perform(post("/api/products")
        .contentType(MediaType.APPLICATION_JSON)
        .content(request))
      .andExpect(status().isCreated())
      .andReturn()
      .getResponse()
      .getContentAsString();

    return objectMapper.readTree(response).get("id").asLong();
  }
}
