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
import java.util.List;

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

    @Test
    void testGetAllTodos() throws Exception {
        Todo mockTodo1 = new Todo("Test Todo 1", Todo.Priority.HIGH, LocalDateTime.of(2025, 1, 1, 0, 0));
        mockTodo1.setId(1L);
        Todo mockTodo2 = new Todo("Test Todo 2", Todo.Priority.MEDIUM, LocalDateTime.of(2025, 1, 2, 0, 0));
        mockTodo2.setId(2L);
        
        TodoService.PageResponse mockPageResponse = new TodoService.PageResponse(
            List.of(mockTodo1, mockTodo2), 
            2L
        );
        
        when(todoService.getAllTodos(any(int.class), any(int.class), any(), any(), any(), any())).thenReturn(mockPageResponse);

        RequestBuilder request = MockMvcRequestBuilders
            .get("/todos")
            .param("page", "0")
            .param("size", "10")
            .accept(MediaType.APPLICATION_JSON);

        MvcResult result = mvc.perform(request).andReturn();
        assertEquals(HttpStatus.OK.value(), result.getResponse().getStatus());
        assertEquals(MediaType.APPLICATION_JSON_VALUE, result.getResponse().getContentType());
    }

    @Test
    void testMarkAsDone() throws Exception {
        Long todoId = 1L;
        Todo mockTodo = new Todo("Test Todo", Todo.Priority.HIGH, LocalDateTime.of(2025, 1, 1, 0, 0));
        mockTodo.setId(todoId);
        mockTodo.setDone(true);
        
        when(todoService.markAsDone(any(Long.class))).thenReturn(mockTodo);

        RequestBuilder request = MockMvcRequestBuilders
            .post("/todos/" + todoId + "/done")
            .accept(MediaType.APPLICATION_JSON);

        MvcResult result = mvc.perform(request).andReturn();
        assertEquals(HttpStatus.OK.value(), result.getResponse().getStatus());
        assertEquals(MediaType.APPLICATION_JSON_VALUE, result.getResponse().getContentType());
    }

    @Test
    void testMarkAsUndone() throws Exception {
        Long todoId = 1L;
        Todo mockTodo = new Todo("Test Todo", Todo.Priority.HIGH, LocalDateTime.of(2025, 1, 1, 0, 0));
        mockTodo.setId(todoId);
        mockTodo.setDone(false);
        
        when(todoService.markAsUndone(any(Long.class))).thenReturn(mockTodo);

        RequestBuilder request = MockMvcRequestBuilders
            .put("/todos/" + todoId + "/undone")
            .accept(MediaType.APPLICATION_JSON);

        MvcResult result = mvc.perform(request).andReturn();
        assertEquals(HttpStatus.OK.value(), result.getResponse().getStatus());
        assertEquals(MediaType.APPLICATION_JSON_VALUE, result.getResponse().getContentType());
    }

    @Test
    void testDeleteTodo() throws Exception {
        Long todoId = 1L;
        
        // deleteTodo returns void, so we don't need to mock a return value
        // We just need to verify the service method is called
        
        RequestBuilder request = MockMvcRequestBuilders
            .delete("/todos/" + todoId)
            .accept(MediaType.APPLICATION_JSON);

        MvcResult result = mvc.perform(request).andReturn();
        assertEquals(HttpStatus.NO_CONTENT.value(), result.getResponse().getStatus());
    }
}
