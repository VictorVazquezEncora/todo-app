package com.encora.victorvazquez.todo_app.todo;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Todo {
    private Long id;
    private String text;
    private LocalDateTime dueDate;
    private boolean done;
    private LocalDateTime doneDate;
    private Priority priority;
    private LocalDateTime creationDate;

    public enum Priority {
        HIGH, MEDIUM, LOW
    }

    public Todo() {
        this.done = false;
        this.creationDate = LocalDateTime.now();
    }

    @JsonCreator
    public Todo(
        @JsonProperty("text") String text,
        @JsonProperty("priority") Priority priority,
        @JsonProperty("dueDate") LocalDateTime dueDate
    ) {
        this.text = text;
        this.priority = priority;
        this.dueDate = dueDate;
        this.done = false;
        this.creationDate = LocalDateTime.now();
    }

    public Todo(Long id, String text, Priority priority, LocalDateTime dueDate) {
        this.id = id;
        this.text = text;
        this.priority = priority;
        this.dueDate = dueDate;
        this.done = false;
        this.creationDate = LocalDateTime.now();
    }

    public Todo(Long id, String text, Priority priority) {
        this(id, text, priority, null);
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getText() {
        return text;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public boolean isDone() {
        return done;
    }

    public LocalDateTime getDoneDate() {
        return doneDate;
    }

    public Priority getPriority() {
        return priority;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setText(String text) {
        if (text != null && text.length() <= 120) {
            this.text = text;
        } else {
            throw new IllegalArgumentException("Text is required and must not exceed 120 characters");
        }
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public void setDone(boolean done) {
        this.done = done;
        if (done) {
            this.doneDate = LocalDateTime.now();
        } else {
            this.doneDate = null;
        }
    }

    public void setPriority(Priority priority) {
        if (priority == null) {
            throw new IllegalArgumentException("Priority is required");
        }
        this.priority = priority;
    }
}
