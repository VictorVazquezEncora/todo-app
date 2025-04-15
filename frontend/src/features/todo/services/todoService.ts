import { get, post, put, del } from "../../../lib/fetch";
import { Todo, TodoFilters, PaginationState, TodoMetrics } from "../types";

interface PageResponse {
  data: Todo[];
  totalItems: number;
}

// Build query parameters for filtering and pagination
const buildQueryParams = (
  filters?: TodoFilters,
  pagination?: Partial<PaginationState>,
  sortString?: string | null
): string => {
  const params = new URLSearchParams();

  // Add filter parameters if they exist
  if (filters) {
    if (filters.text && filters.text.trim() !== "") {
      params.append("text", filters.text);
    }

    if (filters.priority && filters.priority !== "ALL") {
      params.append("priority", filters.priority);
    }

    if (filters.status && filters.status !== "ALL") {
      params.append("status", filters.status.toLowerCase());
    }
  }

  // Add pagination parameters if they exist
  if (pagination) {
    if (pagination.pageSize) {
      params.append("size", pagination.pageSize.toString());
    }

    if (pagination.currentPage !== undefined) {
      // API usually expects 0-based index for pages
      params.append("page", pagination.currentPage.toString());
    }
  }

  // Add sorting parameters if they exist
  if (sortString) {
    params.append("sortBy", sortString);
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};

// Fetch all todos with optional filters and pagination
export const fetchTodos = async (
  filters?: TodoFilters,
  pagination?: Partial<PaginationState>,
  sortString?: string | null
): Promise<PageResponse> => {
  const queryParams = buildQueryParams(filters, pagination, sortString);
  const response = await get<PageResponse>(`/todos${queryParams}`);

  console.log("RESPONSE");
  console.log(response);

  return response;
};

export const createTodo = async (
  todo: Omit<Todo, "id" | "done" | "doneDate" | "creationDate">
): Promise<Todo> => {
  return await post<Todo>("/todos", todo);
};

export const updateTodo = async (
  id: number,
  updates: Partial<Todo>
): Promise<Todo> => {
  return await put<Todo>(`/todos/${id}`, updates);
};

export const markTodoAsDone = async (id: number): Promise<Todo> => {
  return await post<Todo>(`/todos/${id}/done`, {});
};

export const markTodoAsUndone = async (id: number): Promise<Todo> => {
  return await put<Todo>(`/todos/${id}/undone`, {});
};

export const fetchTodoMetrics = async (): Promise<TodoMetrics> => {
  const todos = await fetchTodos();

  console.log("TODOS FROM METRICS");
  console.log(todos);

  // Calculate completed todos and their completion times
  const completedTodos = todos.data.filter(
    (todo) => todo.done && todo.doneDate
  );

  // If no completed todos, return default metrics
  if (completedTodos.length === 0) {
    return {
      averageTime: 0,
      byPriority: {
        LOW: 0,
        MEDIUM: 0,
        HIGH: 0,
      },
    };
  }

  // Calculate average completion time
  const completionTimes = completedTodos.map((todo) => {
    const creationDate = new Date(todo.creationDate);
    const doneDate = new Date(todo.doneDate);
    return (doneDate.getTime() - creationDate.getTime()) / (1000 * 60); // Convert to minutes
  });

  const averageTime =
    completionTimes.length > 0
      ? completionTimes.reduce((acc, time) => acc + time, 0) /
        completionTimes.length
      : 0;

  // Calculate average time by priority
  const byPriority = completedTodos.reduce((acc, todo) => {
    const creationDate = new Date(todo.creationDate);
    const doneDate = new Date(todo.doneDate);
    const completionTime =
      (doneDate.getTime() - creationDate.getTime()) / (1000 * 60); // Convert to minutes

    if (!acc[todo.priority]) {
      acc[todo.priority] = { sum: 0, count: 0 };
    }
    acc[todo.priority].sum += completionTime;
    acc[todo.priority].count += 1;
    return acc;
  }, {} as { [key: string]: { sum: number; count: number } });

  // Convert to average times with default values for all priorities
  const averageByPriority = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    ...Object.entries(byPriority).reduce((acc, [priority, data]) => {
      acc[priority] =
        data.count > 0 ? parseFloat((data.sum / data.count).toFixed(0)) : 0;
      return acc;
    }, {} as { [key: string]: number }),
  };

  console.log("BY PRIORITY");
  console.log(averageByPriority);
  console.log("AVERAGE TIME");
  console.log(averageTime);

  return {
    averageTime: parseFloat(averageTime.toFixed(0)),
    byPriority: averageByPriority,
  };
};

export const deleteTodo = async (id: number): Promise<void> => {
  return await del(`/todos/${id}`);
};
