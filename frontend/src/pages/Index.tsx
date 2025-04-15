import Header from "@/components/Header";
import TodoList from "@/features/todo/components/TodoList";
import TodoMetrics from "@/features/todo/components/TodoMetrics";
import { TodoProvider } from "@/features/todo/context/TodoContext";

const Index = () => {
  return (
    <TodoProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="p-4 w-3/4 self-center">
          <TodoList />
        </div>
        <div className="p-4 w-3/4 self-center">
          <TodoMetrics />
        </div>
      </div>
    </TodoProvider>
  );
};

export default Index;
