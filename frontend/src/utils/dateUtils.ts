import { differenceInDays, format, parseISO } from "date-fns";

// Format date string to display format
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "";
  try {
    return format(parseISO(dateString), "MMM d, yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

// Get urgency level based on due date
export const getDueDateUrgency = (
  dueDate: string | null
): "urgent" | "moderate" | "normal" | null => {
  if (!dueDate) return null;

  try {
    const today = new Date();
    const dueDateObj = parseISO(dueDate);
    const daysUntilDue = differenceInDays(dueDateObj, today);

    if (daysUntilDue <= 7) {
      return "urgent";
    } else if (daysUntilDue <= 14) {
      return "moderate";
    } else {
      return "normal";
    }
  } catch (error) {
    console.error("Error determining due date urgency:", error);
    return null;
  }
};
