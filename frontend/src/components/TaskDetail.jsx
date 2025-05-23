import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LogSection from "./LogSection";

const TaskDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const task = location.state?.task || JSON.parse(localStorage.getItem("selectedTask"));

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow max-w-md w-full text-center">
          <p className="mb-4">Task tidak ditemukan.</p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate("/mainmenu")}
          >
            Kembali ke menu utama
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">{task.title}</h1>
        <div className="mb-4">
          <p className="text-gray-700 mb-2"><strong>Deskripsi:</strong> {task.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="text-gray-700"><strong>Status:</strong> {task.status}</p>
            <p className="text-gray-700"><strong>Mulai:</strong> {task.startDate}</p>
            <p className="text-gray-700"><strong>Deadline:</strong> {task.endDate}</p>
          </div>
        </div>
        <hr className="my-6" />
        <LogSection taskId={task.id || task._id} />
        <div className="mt-8 flex justify-end">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={() => navigate("/mainmenu")}
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
