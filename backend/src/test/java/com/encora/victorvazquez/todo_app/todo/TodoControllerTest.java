package com.encora.victorvazquez.todo_app.todo;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;
import java.util.List;

import com.encora.victorvazquez.todo_app.todo.repository.InMemoryTodoRepository;

public class TodoControllerTest {
    private TodoController createController() {
        return new TodoController(new TodoService(new InMemoryTodoRepository()));
    }

    @Test
    void testCreateTodo() {
        TodoController controller = createController();
        Todo todo = new Todo("Test Todo", Todo.Priority.LOW, LocalDateTime.of(2025, 1, 1, 0, 0));
        ResponseEntity<Todo> response = controller.createTodo(todo);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(todo.getText(), response.getBody().getText());
        assertEquals(todo.getPriority(), response.getBody().getPriority());
        assertEquals(todo.getDueDate(), response.getBody().getDueDate());
    }

    @Test
    void testDeleteTodo() {
        TodoController controller = createController();
        Todo todo = new Todo("Test Todo", Todo.Priority.LOW, LocalDateTime.now());
        Todo createdTodo = controller.createTodo(todo).getBody();
        assertNotNull(createdTodo);
        assertNotNull(createdTodo.getId());

        ResponseEntity<Void> response = controller.deleteTodo(createdTodo.getId());
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

    @Test
    void testGetAllTodos() {
        TodoController controller = createController();
        Todo todo1 = new Todo("Test Todo 1", Todo.Priority.HIGH, LocalDateTime.now());
        Todo todo2 = new Todo("Test Todo 2", Todo.Priority.MEDIUM, LocalDateTime.now().plusDays(1));
        controller.createTodo(todo1);
        controller.createTodo(todo2);

        ResponseEntity<TodoService.PageResponse> response = controller.getAllTodos(0, 10, null, null, null, null);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().getTotalItems());
        List<Todo> todos = response.getBody().getData();
        assertEquals(2, todos.size());
    }

    @Test
    void testMarkAsDone() {
        TodoController controller = createController();
        Todo todo = new Todo("Test Todo", Todo.Priority.LOW, LocalDateTime.now());
        Todo createdTodo = controller.createTodo(todo).getBody();
        assertNotNull(createdTodo);

        ResponseEntity<Todo> response = controller.markAsDone(createdTodo.getId());
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isDone());
    }

    @Test
    void testMarkAsUndone() {
        TodoController controller = createController();
        Todo todo = new Todo("Test Todo", Todo.Priority.LOW, LocalDateTime.now());
        Todo createdTodo = controller.createTodo(todo).getBody();
        assertNotNull(createdTodo);
        controller.markAsDone(createdTodo.getId());

        ResponseEntity<Todo> response = controller.markAsUndone(createdTodo.getId());
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(!response.getBody().isDone());
    }

}
