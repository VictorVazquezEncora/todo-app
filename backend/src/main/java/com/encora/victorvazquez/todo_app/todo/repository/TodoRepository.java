package com.encora.victorvazquez.todo_app.todo.repository;

import com.encora.victorvazquez.todo_app.common.BaseRepository;
import com.encora.victorvazquez.todo_app.todo.Todo;
import java.util.List;

public interface TodoRepository extends BaseRepository<Todo, Long> {
    List<Todo> findAll(String status, String text, Todo.Priority priority);
} 