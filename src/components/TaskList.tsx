// components/TaskList.tsx
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TaskList: React.FC<{ tasks: any[] }> = ({ tasks }) => {
  console.log(tasks, "tasklist");
  return (
    <div className="bg-white p-4 shadow rounded w-full">
      <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
      {tasks?.length === 0 ? (
        <p>No tasks yet. Add one!</p>
      ) : (
        <ul className="space-y-2">
          {tasks?.map((task, index) => (
            <li key={index} className="p-2 border rounded">
              <h3 className="text-lg font-bold">{task.title}</h3>
              <p className="text-sm">{task.description}</p>
              <p className="text-sm text-gray-500">From: {task.timeFrom}</p>
              <p className="text-sm text-gray-500">To: {task.timeTo}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
