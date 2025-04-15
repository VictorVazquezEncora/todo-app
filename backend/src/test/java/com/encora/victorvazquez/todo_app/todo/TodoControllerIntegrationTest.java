package com.encora.victorvazquez.todo_app.todo;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;

@ExtendWith(SpringExtension.class)
@WebMvcTest(TodoController.class)
public class TodoControllerIntegrationTest {
    @Autowired
    private MockMvc mvc;

    @MockBean
    private TodoService todoService;

    @Test
    void testCreateTodo() throws Exception {
        String todoJson = """
            {
                "text": "Test Todo",
                "priority": "HIGH",
                "dueDate": "2025-01-01T00:00:00"
            }""";

        Todo mockTodo = new Todo("Test Todo", Todo.Priority.HIGH, LocalDateTime.of(2025, 1, 1, 0, 0));
        when(todoService.createTodo(any(Todo.class))).thenReturn(mockTodo);

        RequestBuilder request = MockMvcRequestBuilders
            .post("/todos")
            .accept(MediaType.APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON)
            .content(todoJson);

        MvcResult result = mvc.perform(request).andReturn();
        assertEquals(HttpStatus.OK.value(), result.getResponse().getStatus());
        assertEquals(MediaType.APPLICATION_JSON_VALUE, result.getResponse().getContentType());
    }

    @Test
    void testUpdateTodo() throws Exception {
        Long todoId = 1L;
        String updateJson = """
            {
                "text": "Updated Todo",
                "priority": "MEDIUM",
                "dueDate": "2025-02-01T00:00:00"
            }""";

        Todo mockUpdatedTodo = new Todo("Updated Todo", Todo.Priority.MEDIUM, LocalDateTime.of(2025, 2, 1, 0, 0));
        mockUpdatedTodo.setId(todoId);
        when(todoService.updateTodo(any(Long.class), any(Todo.class))).thenReturn(mockUpdatedTodo);

        RequestBuilder request = MockMvcRequestBuilders
            .put("/todos/" + todoId)
            .accept(MediaType.APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON)
            .content(updateJson);

        MvcResult result = mvc.perform(request).andReturn();
        assertEquals(HttpStatus.OK.value(), result.getResponse().getStatus());
        assertEquals(MediaType.APPLICATION_JSON_VALUE, result.getResponse().getContentType());
    }
}
