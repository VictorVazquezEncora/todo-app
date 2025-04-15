import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { formatDate, getDueDateUrgency } from "@/utils/dateUtils";
import { Trash2, Pencil } from "lucide-react";
import React from "react";
import { useTodo } from "../context/useTodo";
import { Todo } from "../types";

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: number) => void;
  onEdit: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onDelete, onEdit }) => {
  const { toggleTodoStatus } = useTodo();

  const handleStatusToggle = async () => {
    await toggleTodoStatus(todo.id, !todo.done);
  };

  const handleDeleteClick = () => {
    onDelete(todo.id);
  };

  const handleEditClick = () => {
    onEdit(todo);
  };

  // Determine urgency for styling
  const urgency = todo.dueDate ? getDueDateUrgency(todo.dueDate) : null;

  // Build class names for the todo item
  const itemClasses = cn(
    "grid grid-cols-12 items-center p-3 border-b transition-all",
    todo.done ? "task-done" : "",
    urgency === "urgent" ? "task-urgent" : "",
    urgency === "moderate" ? "task-moderate" : "",
    urgency === "normal" ? "task-normal" : ""
  );

  // Priority badge color
  const priorityBadgeClass = cn(
    "px-2 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center",
    {
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300":
        todo.priority === "HIGH",
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300":
        todo.priority === "MEDIUM",
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300":
        todo.priority === "LOW",
    }
  );

  return (
    <div className={itemClasses}>
      <div className="col-span-1 flex justify-center">
        <Checkbox checked={todo.done} onCheckedChange={handleStatusToggle} />
      </div>

      <div className="col-span-5 font-medium text-left">{todo.text}</div>

      <div className="col-span-2 flex justify-center">
        <span className={priorityBadgeClass}>{todo.priority}</span>
      </div>

      <div className="col-span-2 text-center text-sm">
        {todo.dueDate ? formatDate(todo.dueDate) : "-"}
      </div>

      <div className="col-span-2 flex justify-end space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleEditClick}
          className="h-8 w-8"
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDeleteClick}
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </div>
  );
};

export default TodoItem;
