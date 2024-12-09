"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase/config";
import { collection, query, getDocs, orderBy, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

// Define the Task type
type Task = {
  id: string;
  title: string;
  description: string;
  timeFrom: string;
  timeTo: string;
  userId: string;
};

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch the current user's ID
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch tasks for the current user
  const fetchTasks = async () => {
    if (!currentUserId) return;

    try {
      const q = query(
        collection(db, "tasks"),
        where("userId", "==", currentUserId),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);

      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];

      setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [currentUserId]); // Refetch tasks when currentUserId changes

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
      <ul className="space-y-2">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id} className="border rounded p-2">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="text-gray-600">{task.description}</p>
              <div className="flex space-x-4 mt-2">
                <Link href={`/tasks/${task.id}`} legacyBehavior>
                  <a className="text-blue-600">View</a>
                </Link>
                <Link href={`/tasks/${task.id}/edit`} legacyBehavior>
                  <a className="text-green-600">Edit</a>
                </Link>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-600">No tasks found for the current user.</p>
        )}
      </ul>
    </div>
  );
};

export default TasksPage;
