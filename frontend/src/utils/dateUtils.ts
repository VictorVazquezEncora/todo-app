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

// Format minutes into days:hours:minutes format
export const formatMinutesToDuration = (minutes: number): string => {
  if (minutes === 0) return "0m";
  
  const days = Math.floor(minutes / (24 * 60));
  const hours = Math.floor((minutes % (24 * 60)) / 60);
  const remainingMinutes = Math.floor(minutes % 60);
  
  const parts = [];
  
  if (days > 0) {
    parts.push(`${days}d`);
  }
  
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  
  if (remainingMinutes > 0) {
    parts.push(`${remainingMinutes}m`);
  }
  
  return parts.length > 0 ? parts.join(" ") : "0m";
};
