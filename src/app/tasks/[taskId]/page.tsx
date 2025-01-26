'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../../lib/firebase/config';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';

const TaskDetailsPage = ({ params }: { params: { taskId: string } }) => {
  const [task, setTask] = useState<{
    id: string;
    title: string;
    description: string;
    timeFrom: string;
    timeTo: string;
  } | null>(null);
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  const { taskId } = React.use(params);

  const fetchTask = async () => {
    const docRef = doc(db, 'tasks', taskId);
    const docSnap = getDoc(docRef);
    if (docSnap.exists()) {
      const taskData = docSnap.data();
      setTask({
        id: docSnap.id,
        title: taskData.title,
        description: taskData.description,
        timeFrom: taskData.timeFrom,
        timeTo: taskData.timeTo,
      });
    } else {
      console.error('Task not found!');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      alert('Task deleted successfully!');
      router.push('/tasks');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  if (!task) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{task.title}</h1>
      <p className="text-gray-600">{task.description}</p>
      <p>
        Time: {task.timeFrom} - {task.timeTo}
      </p>
      <div className="flex space-x-4 mt-4">
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskDetailsPage;
