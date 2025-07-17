import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// Mock the formatMinutesToDuration function
jest.mock("../../../../utils/dateUtils", () => ({
  formatMinutesToDuration: jest.fn((minutes) => `${minutes}m`),
}));

// Mock the useTodo hook - create a jest.fn() directly in the mock
jest.mock("../../context/useTodo", () => ({
  useTodo: jest.fn(),
}));

// Now import the component and the mocked hook
import TodoMetrics from "../../components/TodoMetrics";
import { useTodo } from "../../context/useTodo";

// Get reference to the mocked function
const mockUseTodo = useTodo as jest.MockedFunction<typeof useTodo>;

const mockMetrics = {
  averageTime: 19,
  byPriority: {
    LOW: 0,
    MEDIUM: 19,
    HIGH: 0,
  },
};

const defaultMockReturn = {
  todos: [],
  isLoading: false,
  error: null,
  filters: { text: "", priority: "ALL" as const, status: "ALL" as const },
  setFilters: jest.fn(),
  sorting: { sortString: null },
  pagination: { currentPage: 0, pageSize: 10, totalItems: 0 },
  metrics: mockMetrics,
  toggleTodoStatus: jest.fn(),
  setSort: jest.fn(),
  setPage: jest.fn(),
  setPageSize: jest.fn(),
  refreshTodos: jest.fn(),
  refreshMetrics: jest.fn(),
};

describe("TodoMetrics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset and setup the mock
    mockUseTodo.mockReturnValue(defaultMockReturn);
  });

  it("should render the average time section title", () => {
    render(<TodoMetrics />);
    expect(screen.getByText("Average time to finish tasks:")).toBeInTheDocument();
  });

  it("should render the priority breakdown section title", () => {
    render(<TodoMetrics />);
    expect(screen.getByText("Average time to finish tasks by priority:")).toBeInTheDocument();
  });

  it("should display priority breakdown labels", () => {
    render(<TodoMetrics />);
    expect(screen.getByText("Low:")).toBeInTheDocument();
    expect(screen.getByText("Medium:")).toBeInTheDocument();
    expect(screen.getByText("High:")).toBeInTheDocument();
  });

  it("should handle null metrics gracefully", () => {
    mockUseTodo.mockReturnValue({
      ...defaultMockReturn,
      metrics: null,
    });

    render(<TodoMetrics />);
    expect(screen.getByText("Average time to finish tasks:")).toBeInTheDocument();
    expect(screen.getByText("Average time to finish tasks by priority:")).toBeInTheDocument();
  });

  it("should handle undefined metrics gracefully", () => {
    mockUseTodo.mockReturnValue({
      ...defaultMockReturn,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      metrics: undefined as any,
    });

    render(<TodoMetrics />);
    expect(screen.getByText("Average time to finish tasks:")).toBeInTheDocument();
    expect(screen.getByText("Average time to finish tasks by priority:")).toBeInTheDocument();
  });
}); 