import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { X } from "lucide-react";
import { Priority, Todo } from "../types";
import { useTodo } from "../context/useTodo";
import * as todoService from "../services/todoService";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TodoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  todo?: Todo;
  onSuccess?: () => void;
}

const TodoModal: React.FC<TodoModalProps> = ({
  open,
  onOpenChange,
  mode,
  todo,
  onSuccess,
}) => {
  const { refreshTodos } = useTodo();
  const [isLoading, setIsLoading] = useState(false);

  const [text, setText] = useState(todo?.text || "");
  const [priority, setPriority] = useState<Priority>(
    todo?.priority || "MEDIUM"
  );
  const [date, setDate] = useState<Date | undefined>(
    todo?.dueDate ? new Date(todo.dueDate) : undefined
  );

  useEffect(() => {
    if (todo) {
      setText(todo.text);
      setPriority(todo.priority);
      setDate(todo.dueDate ? new Date(todo.dueDate) : undefined);
    }
  }, [todo]);

  const resetForm = () => {
    setText("");
    setPriority("MEDIUM");
    setDate(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      return;
    }

    setIsLoading(true);

    const todoData = {
      text,
      priority,
      dueDate: date ? date.toISOString() : null,
    };

    try {
      if (mode === "create") {
        await todoService.createTodo(todoData);
        toast.success("Task created", {
          description: "Your task has been successfully created.",
        });
      } else if (mode === "edit" && todo?.id) {
        await todoService.updateTodo(todo.id, todoData);
        toast.success("Task updated", {
          description: "Your task has been successfully updated.",
        });
      }

      // await refreshTodos();
      await refreshTodos();
      onSuccess?.();
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting todo:", error);
      toast.error("Failed to save task", {
        description: "There was an error saving your task. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearDate = () => {
    setDate(undefined);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
        }
        onOpenChange(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Task" : "Edit Task"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <label
              htmlFor="text"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Task Name
            </label>
            <Input
              id="text"
              placeholder="Enter task name"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={120}
              required
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="priority"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Priority
            </label>
            <Select
              value={priority}
              onValueChange={(value: Priority) => setPriority(value)}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="dueDate"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Due Date (Optional)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                id="dueDate"
                className="w-full"
                value={date ? format(date, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  const newDate = e.target.value
                    ? new Date(e.target.value + "T12:00:00")
                    : undefined;
                  setDate(newDate);
                }}
              />
              {date && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={clearDate}
                  className="h-10 w-10"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear date</span>
                </Button>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : mode === "create"
              ? "Create Task"
              : "Update Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TodoModal;
