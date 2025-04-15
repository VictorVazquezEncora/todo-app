import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { useTodo } from "../context/useTodo";
import TodoItem from "./TodoItem";
import TodoModal from "./TodoModal";
import { deleteTodo } from "../services/todoService";
import { Todo } from "../types";
import TodoFilter from "./TodoFilter";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type SortDirection = "asc" | "dsc" | null;
type SortField = "priority" | "duedate" | null;

interface SortState {
  priority: SortDirection;
  duedate: SortDirection;
}

const TodoList = () => {
  const {
    todos = [],
    isLoading,
    error,
    refreshTodos,
    pagination,
    setPage,
    setSort,
  } = useTodo();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<Todo | undefined>(undefined);
  const [sortState, setSortState] = useState<SortState>({
    priority: null,
    duedate: null,
  });

  const handleSort = (field: SortField) => {
    if (!field) return;

    const newSortState = { ...sortState };

    // Toggle sort direction for the clicked field
    if (newSortState[field] === null) {
      newSortState[field] = "asc";
    } else if (newSortState[field] === "asc") {
      newSortState[field] = "dsc";
    } else {
      newSortState[field] = null;
    }

    setSortState(newSortState);

    // Build the sort string
    const sortCriteria = Object.entries(newSortState)
      .filter(([, direction]) => direction !== null)
      .map(([field, direction]) => `${field}_${direction}`)
      .join("-");

    setSort(sortCriteria);
  };

  const getSortIcon = (field: SortField) => {
    if (!field) return null;

    const direction = sortState[field];
    if (!direction) return null;

    return direction === "asc" ? (
      <ArrowUp className="h-4 w-4 inline-block ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 inline-block ml-1" />
    );
  };

  const handleCreateTask = () => {
    setTodoToEdit(undefined);
    setIsModalOpen(true);
  };

  const handleEditTask = (todo: Todo) => {
    setTodoToEdit(todo);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    try {
      await deleteTodo(id);
      await refreshTodos();
      toast.success("Task deleted", {
        description: "Your task has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Error", {
        description: "Failed to delete task. Please try again.",
      });
    }
  };

  const getTodoHeader = () => (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-foreground">My Tasks</h2>
      <Button
        onClick={handleCreateTask}
        size="sm"
        variant="outline"
        className="bg-background border-2 hover:bg-accent text-foreground"
      >
        <Plus className="h-4 w-4 mr-2" />
        New Task
      </Button>
    </div>
  );

  const getTableHeader = () => (
    <div className="grid grid-cols-12 p-3 border-b font-medium text-sm">
      <div className="col-span-1 flex justify-center">#</div>
      <div className="col-span-5 text-left">Name</div>
      <div
        className="col-span-2 text-center cursor-pointer hover:text-primary"
        onClick={() => handleSort("priority")}
      >
        Priority {getSortIcon("priority")}
      </div>
      <div
        className="col-span-2 text-center cursor-pointer hover:text-primary"
        onClick={() => handleSort("duedate")}
      >
        Due Date {getSortIcon("duedate")}
      </div>
      <div className="col-span-2 text-right">Actions</div>
    </div>
  );

  if (error) {
    return (
      <div className="space-y-6">
        {getTodoHeader()}
        <div className="bg-card rounded-md border shadow-sm p-8 text-center text-destructive">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and sorting section */}
      <div className="bg-card p-4 rounded-md border shadow-sm">
        <TodoFilter />
      </div>

      {getTodoHeader()}

      {/* Todo list section */}
      <div className="bg-card rounded-md border shadow-sm overflow-hidden">
        {getTableHeader()}

        {isLoading ? (
          <div className="p-8 text-center">Loading tasks...</div>
        ) : !Array.isArray(todos) ? (
          <div className="p-8 text-center text-destructive">
            Error: Invalid data format
          </div>
        ) : todos.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No tasks found matching your filters.
          </div>
        ) : (
          <div className="divide-y">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={handleDeleteClick}
                onEdit={() => handleEditTask(todo)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {todos.length > 0 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setPage(Math.max(0, pagination.currentPage - 1))
                  }
                  className={
                    pagination.currentPage === 0
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {[
                ...Array(
                  Math.ceil(pagination.totalItems / pagination.pageSize)
                ),
              ].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => setPage(index)}
                    isActive={pagination.currentPage === index}
                    className="cursor-pointer"
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPage(
                      Math.min(
                        Math.ceil(pagination.totalItems / pagination.pageSize) -
                          1,
                        pagination.currentPage + 1
                      )
                    )
                  }
                  className={
                    pagination.currentPage >=
                    Math.ceil(pagination.totalItems / pagination.pageSize) - 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Create/Edit Task Modal */}
      <TodoModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode={todoToEdit ? "edit" : "create"}
        todo={todoToEdit}
        onSuccess={refreshTodos}
      />
    </div>
  );
};

export default TodoList;
