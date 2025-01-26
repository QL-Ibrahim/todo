import React, { useState } from "react";
import { db } from "../lib/firebase/config";
import { collection, addDoc } from "firebase/firestore";
// import { log } from "console";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TaskForm: React.FC<{
  fetchTasks: () => void;
  userId: string | null;
}> = ({ fetchTasks, userId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !timeFrom || !timeTo)
      return alert("Title, Time From, and Time To are required!");

    if (
      new Date(`1970-01-01T${timeFrom}:00`) >=
      new Date(`1970-01-01T${timeTo}:00`)
    )
      return alert("Time From must be earlier than Time To!");
    console.log("hello");

    try {
      console.log(
        userId,
        title,
        description,
        timeFrom,
        timeTo,
        new Date().toISOString(),
      );
      const collectionRef = collection(db, "tasks");
      const docRef = await addDoc(collectionRef, {
        userId,
        title,
        description,
        timeFrom,
        timeTo,
        createdAt: new Date().toISOString(),
      });
      console.log("Document written with ID: ", docRef.id);

      alert("Task added successfully!");
      fetchTasks(); // Refresh the task list

      setTitle("");
      setDescription("");
      setTimeFrom("");
      setTimeTo("");
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  return (
    <div className="bg-white p-4 shadow rounded w-full">
      <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Field */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />

        {/* Description Field */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />

        {/* Time From Field */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium">Time From</label>
            <input
              type="time"
              value={timeFrom}
              onChange={(e) => setTimeFrom(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Time To Field */}
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium">Time To</label>
            <input
              type="time"
              value={timeTo}
              onChange={(e) => setTimeTo(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Task
        </button>
      </form>
    </div>
  );
};
