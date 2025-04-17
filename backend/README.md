# Todo App Backend

A RESTful Spring Boot backend application that provides a Todo management system with features like task creation, filtering, sorting, and status management.

## Requirements

For building and running the application you need:

- [JDK 17](https://www.oracle.com/java/technologies/downloads/#java17)
- [Maven 3](https://maven.apache.org)

## Running the application locally

There are several ways to run a Spring Boot application on your local machine. One way is to execute the `main` method in the `com.encora.victorvazquez.todo_app.TodoAppApplication` class from your IDE.

Alternatively you can use the [Spring Boot Maven plugin](https://docs.spring.io/spring-boot/docs/current/reference/html/build-tool-plugins-maven-plugin.html) like so (remember to have maven installed):

```shell
mvn spring-boot:run
```

If you don't have maven installed and you want to run it from the local one in the project you can use:
```shell
./mvnw spring-boot:run
```

To run the tests you have to execute the following command

```shell
mvn test
```

or if you don't have maven installed

```shell
./mvnw test
```

## Features

### Todo Management
- Create new todos with text, priority, and optional due date
- Update existing todos
- Delete todos
- Mark todos as done/undone
- Priority levels: HIGH, MEDIUM, LOW

### Querying
- Pagination support
- Sorting by priority and due date
- Filter by status (done/undone)
- Text search in todo descriptions
- Filter by priority level

## API Endpoints
- GET /todos # List todos with filtering and pagination
- POST /todos # Create a new todo
- PUT /todos/{id} # Update a todo
- DELETE /todos/{id} # Delete a todo
- POST /todos/{id}/done # Mark a todo as done
- PUT /todos/{id}/undone # Mark a todo as undone

## Architecture

The application follows a layered architecture:

- **Controller Layer** (`TodoController`): Handles HTTP requests and responses
- **Service Layer** (`TodoService`): Contains business logic and data processing
- **Repository Layer** (`TodoRepository`): Manages data persistence
- **Model** (`Todo`): Represents the domain entity

## Data Storage

Currently implements an in-memory storage solution (`InMemoryTodoRepository`) for todos. The repository pattern is used to make it easy to switch to a different storage solution in the future.

## Development

The project uses Spring Boot DevTools for enhanced development experience with features like automatic restart and live reload.