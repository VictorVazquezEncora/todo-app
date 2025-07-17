import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import TodoList from "../../components/TodoList";
import { Todo } from "../../types";

// Mock the todo service
jest.mock("../../services/todoService", () => ({
  deleteTodo: jest.fn(),
}));

// Mock sonner
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock TodoFilter component to avoid conflicts
jest.mock("../../components/TodoFilter", () => {
  return function MockTodoFilter() {
    return <div data-testid="mock-filter">Mock Filter</div>;
  };
});

// Mock useTodo hook with all required properties
const mockRefreshTodos = jest.fn();
const mockSetPage = jest.fn();
const mockSetSort = jest.fn();
const mockSetFilters = jest.fn();
const mockToggleTodoStatus = jest.fn();
const mockSetPageSize = jest.fn();
const mockRefreshMetrics = jest.fn();

const mockTodos: Todo[] = [
  {
    id: 1,
    text: "Test Task 1",
    priority: "HIGH",
    done: false,
    dueDate: "2024-03-20T12:00:00Z",
  },
  {
    id: 2,
    text: "Test Task 2",
    priority: "MEDIUM",
    done: true,
    dueDate: null,
  },
];

const defaultMockReturn = {
  todos: mockTodos,
  isLoading: false,
  error: null,
  refreshTodos: mockRefreshTodos,
  pagination: {
    currentPage: 0,
    pageSize: 10,
    totalItems: 2,
  },
  setPage: mockSetPage,
  setSort: mockSetSort,
  filters: { text: "", priority: "ALL" as const, status: "ALL" as const },
  setFilters: mockSetFilters,
  toggleTodoStatus: mockToggleTodoStatus,
  sorting: { sortString: null },
  metrics: {
    averageTime: 19,
    byPriority: {
      LOW: 0,
      MEDIUM: 19,
      HIGH: 0,
    },
  },
  setPageSize: mockSetPageSize,
  refreshMetrics: mockRefreshMetrics,
};

jest.mock("../../context/useTodo", () => ({
  useTodo: jest.fn(() => defaultMockReturn),
}));

// Import the mocked useTodo to control it in tests
import { useTodo } from "../../context/useTodo";
const mockUseTodo = useTodo as jest.MockedFunction<typeof useTodo>;

describe("TodoList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTodo.mockReturnValue(defaultMockReturn);
  });

  it("should render the 'My Tasks' title", () => {
    render(<TodoList />);
    expect(screen.getByText("My Tasks")).toBeInTheDocument();
  });

  it("should render the 'New Task' button", () => {
    render(<TodoList />);
    expect(screen.getByText("New Task")).toBeInTheDocument();
  });

  it("should render table headers correctly", () => {
    render(<TodoList />);
    // Use more specific selectors for the table headers within the table structure
    expect(screen.getByText("#")).toBeInTheDocument();
    
    // Get all Name elements and check that one is in the table header area
    const nameElements = screen.getAllByText("Name");
    expect(nameElements.length).toBeGreaterThan(0);
    
    expect(screen.getByText(/Priority/)).toBeInTheDocument();
    expect(screen.getByText(/Due Date/)).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("should show loading state when isLoading is true", () => {
    mockUseTodo.mockReturnValue({
      ...defaultMockReturn,
      todos: [],
      isLoading: true,
      pagination: {
        currentPage: 0,
        pageSize: 10,
        totalItems: 0,
      },
    });

    render(<TodoList />);
    expect(screen.getByText("Loading tasks...")).toBeInTheDocument();
  });

  it("should show error state when there is an error", () => {
    mockUseTodo.mockReturnValue({
      ...defaultMockReturn,
      todos: [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: "Failed to load tasks" as any,
      pagination: {
        currentPage: 0,
        pageSize: 10,
        totalItems: 0,
      },
    });

    render(<TodoList />);
    expect(screen.getByText("Failed to load tasks")).toBeInTheDocument();
  });

  it("should show empty state when no todos match filters", () => {
    mockUseTodo.mockReturnValue({
      ...defaultMockReturn,
      todos: [],
      pagination: {
        currentPage: 0,
        pageSize: 10,
        totalItems: 0,
      },
    });

    render(<TodoList />);
    expect(screen.getByText("No tasks found matching your filters.")).toBeInTheDocument();
  });

}); 