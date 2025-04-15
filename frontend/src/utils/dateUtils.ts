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

// Calculate time difference in minutes
export const getTimeDifferenceInMinutes = (
  startDate: string,
  endDate: string
): number => {
  try {
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    const diffMs = end.getTime() - start.getTime();
    return Math.floor(diffMs / (1000 * 60));
  } catch (error) {
    console.error("Error calculating time difference:", error);
    return 0;
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

// Format minutes to hours and minutes display
export const formatMinutes = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};
