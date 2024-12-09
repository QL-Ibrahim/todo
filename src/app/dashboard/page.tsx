"use client";

import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { Calendar } from "@/components/Calendar";
import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  limit,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { getAuth, onAuthStateChanged } from "@firebase/auth";

// Define the Task type
type Task = {
  id: string;
  title: string;
  description: string;
  timeFrom: string;
  timeTo: string;
  userId: string;
};

export default function DashboardPage() {
  // Use the Task type for the state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch logged-in user's ID
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // export const DashboardPage = () => {
  //   const [tasks, setTasks] = useState([]);
  // const testFirestore = async () => {
  //   try {
  //     const querySnapshot = await getDocs(collection(db, "tasks"));
  //     querySnapshot?.forEach((doc) => {
  //       console.log(`${doc.id} =>`, doc.data());
  //     });
  //   } catch (error) {
  //     console.error("Firestore test failed:", error);
  //   }
  // };

  // testFirestore();

  const fetchTasks = () => {
    if (!userId) return; // Don't fetch if userId is not available
    const q = query(
      collection(db, "tasks"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(5) // Fetch only 5 documents
    );
    onSnapshot(q, (snapshot) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tasksData: any = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
    });
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-4">
      <div className="flex-1 space-y-4">
        <TaskForm fetchTasks={fetchTasks} userId={userId} />
        <TaskList tasks={tasks} />
      </div>
      <div className="w-full md:w-1/3">
        <Calendar />
      </div>
    </div>
  );
}
