import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock the useTodo hook - create a jest.fn() directly in the mock
jest.mock("../../context/useTodo", () => ({
  useTodo: jest.fn(),
}));

// Now import the component and the mocked hook
import TodoFilter from "../../components/TodoFilter";
import { useTodo } from "../../context/useTodo";

// Get reference to the mocked function
const mockUseTodo = useTodo as jest.MockedFunction<typeof useTodo>;

const mockSetFilters = jest.fn();
const defaultMockFilters = {
  text: "",
  priority: "ALL" as const,
  status: "ALL" as const,
};

const defaultMockReturn = {
  todos: [],
  isLoading: false,
  error: null,
  filters: defaultMockFilters,
  setFilters: mockSetFilters,
  sorting: { sortString: null },
  pagination: { currentPage: 0, pageSize: 10, totalItems: 0 },
  metrics: null,
  toggleTodoStatus: jest.fn(),
  setSort: jest.fn(),
  setPage: jest.fn(),
  setPageSize: jest.fn(),
  refreshTodos: jest.fn(),
  refreshMetrics: jest.fn(),
};

describe("TodoFilter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTodo.mockReturnValue(defaultMockReturn);
  });

  it("should render the Name label and input field", () => {
    render(<TodoFilter />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search tasks...")).toBeInTheDocument();
  });

  it("should render the Status label and select dropdown", () => {
    render(<TodoFilter />);
    expect(screen.getByText("Status")).toBeInTheDocument();
    // There should be 2 comboboxes (Priority and Status)
    expect(screen.getAllByRole("combobox")).toHaveLength(2);
  });

  it("should render the Search button", () => {
    render(<TodoFilter />);
    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("should handle text input changes", () => {
    render(<TodoFilter />);
    const textInput = screen.getByPlaceholderText("Search tasks...");
    fireEvent.change(textInput, { target: { value: "test task" } });
    expect(textInput).toHaveValue("test task");
  });

  it("should submit the form with updated filters", () => {
    render(<TodoFilter />);
    const form = screen.getByRole("button", { name: /search/i }).closest("form");
    const textInput = screen.getByPlaceholderText("Search tasks...");
    
    fireEvent.change(textInput, { target: { value: "test task" } });
    fireEvent.submit(form!);
    
    expect(mockSetFilters).toHaveBeenCalledWith({
      text: "test task",
      priority: "ALL",
      status: "ALL",
    });
  });

  it("should initialize with existing filter values", () => {
    // Mock with existing filters
    mockUseTodo.mockReturnValue({
      ...defaultMockReturn,
      filters: {
        text: "existing search",
        priority: "HIGH" as const,
        status: "DONE" as const,
      },
    });

    render(<TodoFilter />);
    const textInput = screen.getByPlaceholderText("Search tasks...");
    expect(textInput).toHaveValue("existing search");
  });

  it("should display the search icon in the button", () => {
    render(<TodoFilter />);
    const searchButton = screen.getByRole("button", { name: /search/i });
    expect(searchButton).toBeInTheDocument();
    // The search icon should be part of the button
    expect(searchButton.querySelector("svg")).toBeInTheDocument();
  });
}); 