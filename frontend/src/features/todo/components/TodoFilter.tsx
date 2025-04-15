import { ChangeEvent, FormEvent, useState } from "react";
import { useTodo } from "../context/useTodo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

type Priority = "ALL" | "LOW" | "MEDIUM" | "HIGH";
type Status = "ALL" | "DONE" | "UNDONE";

interface FilterData {
  text: string;
  priority: Priority;
  status: Status;
}

const TodoFilter = () => {
  const { filters, setFilters } = useTodo();
  const [formData, setFormData] = useState<FilterData>({
    text: filters.text || "",
    priority: (filters.priority as Priority) || "ALL",
    status: (filters.status as Status) || "ALL",
  });

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, text: e.target.value }));
  };

  const handlePriorityChange = (value: Priority) => {
    setFormData((prev) => ({ ...prev, priority: value }));
  };

  const handleStatusChange = (value: Status) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFilters({
      text: formData.text,
      priority: formData.priority,
      status: formData.status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4 items-end">
      <div className="col-span-12">
        <div className="flex items-center w-full">
          <div className="w-[60px]">
            <label className="text-sm font-medium w-full">Name</label>
          </div>
          <div className="w-full">
            <Input
              placeholder="Search tasks..."
              value={formData.text}
              onChange={handleTextChange}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="col-span-5">
        <div className="flex items-center w-full">
          <div className="w-[60px]">
            <label className="text-sm font-medium w-full">Priority</label>
          </div>
          <div className="w-full">
            <Select
              value={formData.priority}
              onValueChange={(value: Priority) => handlePriorityChange(value)}
            >
              <SelectTrigger className="w-full bg-background border-2">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="col-span-5"></div>

      <div className="col-span-5">
        <div className="flex items-center w-full">
          <div className="w-[60px]">
            <label className="text-sm font-medium w-full">Status</label>
          </div>
          <div className="w-full">
            <Select
              value={formData.status}
              onValueChange={(value: Status) => handleStatusChange(value)}
            >
              <SelectTrigger className="w-full bg-background border-2">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
                <SelectItem value="UNDONE">Undone</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="col-span-5"></div>

      <div className="col-span-2">
        <Button
          type="submit"
          size="sm"
          variant="outline"
          className="w-full bg-background border-2 hover:bg-accent text-foreground"
        >
          <Search className="h-4 w-4 mr-2" /> Search
        </Button>
      </div>
    </form>
  );
};

export default TodoFilter;
