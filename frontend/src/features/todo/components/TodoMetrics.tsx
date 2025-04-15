import React, { useEffect } from "react";
import { useTodo } from "../context/useTodo";

const TodoMetrics = () => {
  const { metrics } = useTodo();

  useEffect(() => {
    console.log("METRICS FROM THE COMPONENT THAT WILL SHOW IT");
    console.log(metrics);
  }, [metrics?.averageTime]);

  return (
    <div className="flex justify-between gap-6 p-6 bg-card rounded-lg shadow-sm border">
      {/* Average Time Section */}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          Average time to finish tasks:
        </h2>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-foreground">
            {metrics ? `${metrics.averageTime} minutes` : "0 mins"}
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
                ? `${metrics.byPriority.LOW} mins`
                : "0 mins"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Medium:</span>
            <span className="font-medium text-foreground">
              {metrics?.byPriority?.MEDIUM
                ? `${metrics.byPriority.MEDIUM} mins`
                : "0 mins"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">High:</span>
            <span className="font-medium text-foreground">
              {metrics?.byPriority?.HIGH
                ? `${metrics.byPriority.HIGH} mins`
                : "0 mins"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoMetrics;
