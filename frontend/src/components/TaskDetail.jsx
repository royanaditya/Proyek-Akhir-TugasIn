import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LogSection from "./LogSection";

const TaskDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const task = location.state?.task;

  if (!task) {
    return (
      <div className="p-6">
        <p>Task tidak ditemukan. Kembali ke <button className="text-blue-600 underline" onClick={() => navigate("/mainmenu")}>menu</button>.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{task.title}</h1>
      <p className="text-gray-700 mb-2"><strong>Deskripsi:</strong> {task.description}</p>
      <p className="text-gray-700 mb-2"><strong>Status:</strong> {task.status}</p>
      <p className="text-gray-700 mb-2"><strong>Mulai:</strong> {task.startDate}</p>
      <p className="text-gray-700 mb-4"><strong>Deadline:</strong> {task.endDate}</p>

      <LogSection taskId={task.id} />
    </div>
  );
};

export default TaskDetail;