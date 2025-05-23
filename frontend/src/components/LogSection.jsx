import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/utils";

const LogSection = ({ taskId }) => {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({
    description: "",
    date: "",
  });
  const [editingId, setEditingId] = useState(null);

  const axiosJWT = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  // Interceptor untuk refresh token
  axiosJWT.interceptors.request.use(
    async (config) => {
      const res = await axios.get(`${BASE_URL}/token`, {
        withCredentials: true,
      });
      config.headers.Authorization = `Bearer ${res.data.accessToken}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  const fetchLogs = async () => {
    try {
      const res = await axiosJWT.get(`/get-all-log?taskId=${taskId}`);
      setLogs(res.data);
    } catch (err) {
      console.error("Gagal ambil log:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosJWT.post("/update-log", {
          id: editingId,
          description: form.description,
          logDate: form.date,
          taskId,
        });
      } else {
        await axiosJWT.post("/add-log", {
          description: form.description,
          date: form.date,
          taskId,
        });
      }
      setForm({ description: "", date: "" });
      setEditingId(null);
      fetchLogs();
    } catch (err) {
      console.error("Gagal simpan log:", err);
    }
  };

  const handleEdit = (log) => {
    setForm({ description: log.description, date: log.logDate });
    setEditingId(log.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus log ini?")) return;
    try {
      await axiosJWT.delete(`/delete-log?id=${id}`);
      fetchLogs();
    } catch (err) {
      console.error("Gagal hapus log:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [taskId]);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Logs</h3>
      <form onSubmit={handleSubmit} className="flex gap-2 items-end mb-4">
        <input
          type="text"
          value={form.description}
          placeholder="Log description"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          className="border p-2 rounded w-1/2"
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      <ul className="space-y-2">
        {logs.map((log) => (
          <li key={log.id} className="bg-gray-100 p-3 rounded flex justify-between items-start">
            <div>
              <p className="font-medium">{log.description}</p>
              <p className="text-sm text-gray-600">{log.logDate}</p>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() => handleEdit(log)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => handleDelete(log.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LogSection;
