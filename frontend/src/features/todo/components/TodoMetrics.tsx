import React from "react";
import { formatMinutesToDuration } from "../../../utils/dateUtils";
import { useTodo } from "../context/useTodo";

const TodoMetrics = () => {
  const { metrics } = useTodo();

  return (
    <div className="flex justify-between gap-6 p-6 bg-card rounded-lg shadow-sm border">
      {/* Average Time Section */}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          Average time to finish tasks:
        </h2>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-foreground">
            {metrics ? formatMinutesToDuration(metrics.averageTime) : "0m"}
          </span>
        </div>
      </div>

      {/* Priority Breakdown Section */}
      <div className="p-6 flex flex-col">
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          Average time to finish tasks by priority:
        </h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Low:</span>
            <span className="font-medium text-foreground">
              {metrics?.byPriority?.LOW
                ? formatMinutesToDuration(metrics.byPriority.LOW)
                : "0m"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Medium:</span>
            <span className="font-medium text-foreground">
              {metrics?.byPriority?.MEDIUM
                ? formatMinutesToDuration(metrics.byPriority.MEDIUM)
                : "0m"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">High:</span>
            <span className="font-medium text-foreground">
              {metrics?.byPriority?.HIGH
                ? formatMinutesToDuration(metrics.byPriority.HIGH)
                : "0m"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoMetrics;
