import { createContext, useState, useEffect, ReactNode } from "react";
import {
  Todo,
  TodoFilters,
  TodoSorting,
  PaginationState,
  TodoMetrics,
} from "../types";
import * as todoService from "../services/todoService";
import { toast } from "sonner";

export interface TodoContextType {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  filters: TodoFilters;
  sorting: TodoSorting;
  pagination: PaginationState;
  metrics: TodoMetrics | null;

  // Actions
  toggleTodoStatus: (id: number, done: boolean) => Promise<void>;

  // Filter/Sort/Pagination
  setFilters: (filters: Partial<TodoFilters>) => void;
  setSort: (sortString: string | null) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // Refresh data
  refreshTodos: () => Promise<void>;
  refreshMetrics: () => Promise<void>;
}

const initialState: TodoContextType = {
  todos: [],
  isLoading: false,
  error: null,
  filters: {
    text: "",
    priority: "ALL",
    status: "ALL",
  },
  sorting: {
    sortString: null,
  },
  pagination: {
    pageSize: 10,
    currentPage: 0,
    totalItems: 0,
  },
  metrics: {
    averageTime: 0,
    byPriority: {
      high: 0,
      medium: 0,
      low: 0,
    },
  },
  toggleTodoStatus: async () => {},
  setFilters: () => {},
  setSort: () => {},
  setPage: () => {},
  setPageSize: () => {},
  refreshTodos: async () => {},
  refreshMetrics: async () => {},
};

export const TodoContext = createContext<TodoContextType>(initialState);

export const TodoProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TodoFilters>(initialState.filters);
  const [sorting, setSorting] = useState<TodoSorting>(initialState.sorting);
  const [pagination, setPagination] = useState<PaginationState>(
    initialState.pagination
  );
  const [metrics, setMetrics] = useState<TodoMetrics>(initialState.metrics);

  const fetchTodos = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await todoService.fetchTodos(
        filters,
        { pageSize: pagination.pageSize, currentPage: pagination.currentPage },
        sorting.sortString
      );

      await refreshMetrics();

      setTodos(response.data);
      setPagination((prev) => ({ ...prev, totalItems: response.totalItems }));
    } catch (err) {
      setError("Failed to fetch todos");
      console.error(err);
      toast.error("Failed to load tasks", {
        description:
          "There was an error fetching your tasks. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshMetrics = async () => {
    try {
      const metricsData = await todoService.fetchTodoMetrics();
      setMetrics(structuredClone(metricsData));
    } catch (err) {
      console.error("Failed to fetch metrics:", err);
      toast.error("Failed to load metrics", {
        description:
          "There was an error fetching task metrics. Please try again.",
      });
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchTodos();
      await refreshMetrics();
    };
    initializeData();
  }, []);

  // Effect to load todos when filters/sorting/pagination change
  useEffect(() => {
    fetchTodos();
  }, [filters, sorting, pagination.pageSize, pagination.currentPage]);

  const toggleTodoStatus = async (id: number, done: boolean) => {
    setIsLoading(true);
    setError(null);

    try {
      if (done) {
        await todoService.markTodoAsDone(id);
        toast.success("Task completed", {
          description: "Task has been marked as complete.",
        });
      } else {
        await todoService.markTodoAsUndone(id);
        toast.info("Task reopened", {
          description: "Task has been marked as incomplete.",
        });
      }

      await fetchTodos();
      await refreshMetrics();
    } catch (err) {
      setError("Failed to update todo status");
      console.error(err);
      toast.error("Failed to update task status", {
        description:
          "There was an error updating the task status. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetFilters = (newFilters: Partial<TodoFilters>) => {
    setPagination((prev) => ({ ...prev, currentPage: 0 }));
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSetSort = (sortString: string | null) => {
    setSorting({ sortString });
  };

  const setPage = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const setPageSize = (size: number) => {
    setPagination((prev) => ({ ...prev, pageSize: size, currentPage: 0 }));
  };

  const value = {
    todos,
    isLoading,
    error,
    filters,
    sorting,
    pagination,
    metrics,

    toggleTodoStatus,

    setFilters: handleSetFilters,
    setSort: handleSetSort,
    setPage,
    setPageSize,

    refreshTodos: fetchTodos,
    refreshMetrics,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
