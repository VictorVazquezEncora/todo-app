import { useContext } from "react";
import { TodoContext } from "./TodoContext";
import { TodoContextType } from "./TodoContext";

export const useTodo = (): TodoContextType => {
  const context = useContext(TodoContext);
  return context;
};
