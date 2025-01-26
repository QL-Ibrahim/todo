"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../../../lib/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const EditTaskPage = ({ params }: { params: { taskId: string } }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  const { taskId } = React.use(params);

  // Fetch the logged-in user's ID
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
        router.push("/login"); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchTask = async () => {
    try {
      const docRef = doc(db, "tasks", taskId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const task = docSnap.data();

        if (task.userId !== currentUserId) {
          alert("You are not authorized to edit this task.");
          router.push("/tasks"); // Redirect to tasks list if unauthorized
          return;
        }

        setTitle(task.title);
        setDescription(task.description);
        setTimeFrom(task.timeFrom);
        setTimeTo(task.timeTo);
      } else {
        console.error("Task not found!");
      }
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !timeFrom || !timeTo) {
      return alert("Title, Time From, and Time To are required!");
    }

    try {
      const docRef = doc(db, "tasks", taskId);
      await updateDoc(docRef, { title, description, timeFrom, timeTo });
      alert("Task updated successfully!");
      router.push(`/tasks/${taskId}`);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchTask();
    }
  }, [currentUserId]); // Ensure `fetchTask` runs only when `currentUserId` is set

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Task</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <div className="flex space-x-4">
          <input
            type="time"
            value={timeFrom}
            onChange={(e) => setTimeFrom(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="time"
            value={timeTo}
            onChange={(e) => setTimeTo(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update Task
        </button>
      </form>
    </div>
  );
};

export default EditTaskPage;
