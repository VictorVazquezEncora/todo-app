package com.encora.victorvazquez.todo_app.todo.repository;

import com.encora.victorvazquez.todo_app.todo.Todo;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class InMemoryTodoRepository implements TodoRepository {
    private final List<Todo> todos = new ArrayList<>();
    private Long nextId = 1L;

    @Override
    public List<Todo> findAll() {
        return new ArrayList<>(todos);
    }

    @Override
    public List<Todo> findAll(String status, String text, Todo.Priority priority) {
        return todos.stream()
                .filter(todo -> status == null || todo.isDone() == status.equals("done"))
                .filter(todo -> text == null || todo.getText().toLowerCase().contains(text.toLowerCase()))
                .filter(todo -> priority == null || todo.getPriority() == priority)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Todo> findById(Long id) {
        return todos.stream()
                .filter(todo -> todo.getId().equals(id))
                .findFirst();
    }

    @Override
    public Todo save(Todo todo) {   
        if (todo.getId() == null) {
            todo.setId(nextId++);
            todos.add(todo);
        } else {
            int index = -1;
            for (int i = 0; i < todos.size(); i++) {
                if (todos.get(i).getId().equals(todo.getId())) {
                    index = i;
                    break;
                }
            }
            if (index != -1) {
                todos.set(index, todo);
            } else {
                todos.add(todo);
            }
        }
        return todo;
    }

    @Override
    public void deleteById(Long id) {
        todos.removeIf(todo -> todo.getId().equals(id));
    }

    @Override
    public boolean existsById(Long id) {
        return todos.stream().anyMatch(todo -> todo.getId().equals(id));
    }
} 