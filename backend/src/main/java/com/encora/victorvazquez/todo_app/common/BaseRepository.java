package com.encora.victorvazquez.todo_app.common;

import java.util.List;
import java.util.Optional;

public interface BaseRepository<T, ID> {
    List<T> findAll();
    Optional<T> findById(ID id);
    T save(T entity);
    void deleteById(ID id);
    boolean existsById(ID id);
} 