package com.encora.victorvazquez.todo_app.todo;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/todos")
public class TodoController {
    private final TodoService todoService;
    private final Logger logger = LoggerFactory.getLogger(TodoController.class);

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping
    public ResponseEntity<TodoService.PageResponse> getAllTodos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String text,
            @RequestParam(required = false) Todo.Priority priority
    ) {
        logger.debug("Received GET request for todos with parameters: page={}, size={}, sortBy={}, status={}, text={}, priority={}", 
                    page, size, sortBy, status, text, priority);
        return ResponseEntity.ok(todoService.getAllTodos(page, size, sortBy, status, text, priority));
    }

    @PostMapping
    public ResponseEntity<Todo> createTodo(@RequestBody Todo todo) {
        logger.debug("Received POST request for todo: {}", todo);
        return ResponseEntity.ok(todoService.createTodo(todo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo todo) {
        return ResponseEntity.ok(todoService.updateTodo(id, todo));
    }

    @PostMapping("/{id}/done")
    public ResponseEntity<Todo> markAsDone(@PathVariable Long id) {
        return ResponseEntity.ok(todoService.markAsDone(id));
    }

    @PutMapping("/{id}/undone")
    public ResponseEntity<Todo> markAsUndone(@PathVariable Long id) {
        return ResponseEntity.ok(todoService.markAsUndone(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return ResponseEntity.noContent().build();
    }
}
