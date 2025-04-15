package com.encora.victorvazquez.todo_app.todo;

import com.encora.victorvazquez.todo_app.todo.repository.TodoRepository;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TodoService {
    private final TodoRepository todoRepository;
    private static final Map<Todo.Priority, Integer> PRIORITY_VALUES = Map.of(
        Todo.Priority.HIGH, 3,
        Todo.Priority.MEDIUM, 2,
        Todo.Priority.LOW, 1
    );

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public static class PageResponse {
        private final List<Todo> data;
        private final long totalItems;

        public PageResponse(List<Todo> data, long totalItems) {
            this.data = data;
            this.totalItems = totalItems;
        }

        public List<Todo> getData() {
            return data;
        }

        public long getTotalItems() {
            return totalItems;
        }
    }

    private static class SortCriteria {
        private final String field;
        private final boolean ascending;

        public SortCriteria(String field, boolean ascending) {
            this.field = field;
            this.ascending = ascending;
        }
    }

    private List<SortCriteria> parseSortBy(String sortBy) {
        if (sortBy == null || sortBy.trim().isEmpty()) {
            return Collections.emptyList();
        }

        return Arrays.stream(sortBy.split("-"))
            .map(criteria -> {
                String[] parts = criteria.split("_");
                if (parts.length != 2) {
                    return null;
                }
                return new SortCriteria(parts[0].toLowerCase(), "asc".equals(parts[1].toLowerCase()));
            })
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }

    public PageResponse getAllTodos(int page, int size, String sortBy, String status, String text, Todo.Priority priority) {
        List<Todo> allFilteredTodos = todoRepository.findAll(status, text, priority);
        long totalItems = allFilteredTodos.size();

        List<SortCriteria> sortCriteria = parseSortBy(sortBy);

        List<Todo> paginatedTodos = allFilteredTodos.stream()
            .sorted((t1, t2) -> {
                for (SortCriteria criteria : sortCriteria) {
                    int comparison = switch (criteria.field) {
                        case "priority" -> {
                            int value1 = PRIORITY_VALUES.get(t1.getPriority());
                            int value2 = PRIORITY_VALUES.get(t2.getPriority());
                            int result = Integer.compare(value1, value2);
                            yield criteria.ascending ? result : -result;
                        }
                        case "duedate" -> {
                            if (t1.getDueDate() == null && t2.getDueDate() == null) yield 0;
                            if (t1.getDueDate() == null) yield criteria.ascending ? 1 : -1;
                            if (t2.getDueDate() == null) yield criteria.ascending ? -1 : 1;
                            int result = t1.getDueDate().compareTo(t2.getDueDate());
                            yield criteria.ascending ? result : -result;
                        }
                        default -> 0;
                    };
                    if (comparison != 0) {
                        return comparison;
                    }
                }
                return 0;
            })
            .skip((long) page * size)
            .limit(size)
            .collect(Collectors.toList());

        return new PageResponse(paginatedTodos, totalItems);
    }

    public Todo createTodo(Todo todo) {
        if (todo.getText().length() > 120) {
            throw new IllegalArgumentException("Text cannot be longer than 120 characters");
        }
        if (todo.getPriority() == null) {
            throw new IllegalArgumentException("Priority cannot be null");
        }
        return todoRepository.save(todo);
    }

    public Todo updateTodo(Long id, Todo updatedTodo) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Todo not found with id: " + id));

        if (updatedTodo.getText() != null) {
            todo.setText(updatedTodo.getText());
        }
        if (updatedTodo.getPriority() != null) {
            todo.setPriority(updatedTodo.getPriority());
        }
        todo.setDueDate(updatedTodo.getDueDate());

        return todoRepository.save(todo);
    }

    public Todo markAsDone(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Todo not found with id: " + id));
        if (!todo.isDone()) {
            todo.setDone(true);
            return todoRepository.save(todo);
        }
        return todo;
    }

    public Todo markAsUndone(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Todo not found with id: " + id));
        if (todo.isDone()) {
            todo.setDone(false);
            return todoRepository.save(todo);
        }
        return todo;
    }

    public void deleteTodo(Long id) {
        if (!todoRepository.existsById(id)) {
            throw new IllegalArgumentException("Todo not found with id: " + id);
        }
        todoRepository.deleteById(id);
    }
} 