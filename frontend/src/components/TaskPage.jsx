import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/utils';
import { jwtDecode } from 'jwt-decode';

const TaskPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editingTask = location.state?.task;

  // Ambil id dari task (id atau _id)
  const [editingId, setEditingId] = useState(editingTask?.id || editingTask?._id || null);

  const [form, setForm] = useState({
    title: editingTask?.title || "",
    description: editingTask?.description || "",
    startDate: editingTask?.startDate || "",
    endDate: editingTask?.endDate || "",
    status: editingTask?.status || "To Do",
  });
  const [isUpdate, setIsUpdate] = useState(!!editingTask);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const axiosJWT = useRef(
    axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
    })
  );

  // Pastikan editingId selalu terisi jika ada editingTask
  useEffect(() => {
    if (editingTask && (editingTask.id || editingTask._id)) {
      setEditingId(editingTask.id || editingTask._id);
    }
  }, [editingTask]);

  // Ambil token saat mount
  useEffect(() => {
    const refreshToken = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/token`, { withCredentials: true });
        setToken(res.data.accessToken);
        const decoded = jwtDecode(res.data.accessToken);
        setExpire(decoded.exp);
      } catch {
        navigate("/");
      }
    };
    refreshToken();
  }, [navigate]);

  // Interceptor untuk refresh token jika expired
  useEffect(() => {
    const interceptor = axiosJWT.current.interceptors.request.use(
      async (config) => {
        if (token) {
          const currentDate = new Date();
          if (expire * 1000 < currentDate.getTime()) {
            const res = await axios.get(`${BASE_URL}/token`, { withCredentials: true });
            setToken(res.data.accessToken);
            const decoded = jwtDecode(res.data.accessToken);
            setExpire(decoded.exp);
            config.headers.Authorization = `Bearer ${res.data.accessToken}`;
          } else {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    return () => {
      axiosJWT.current.interceptors.request.eject(interceptor);
    };
  }, [token, expire]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isUpdate) {
        if (!editingId) {
          alert("❌ ID tugas tidak ditemukan. Gagal update.");
          setIsLoading(false);
          return;
        }
        // Kirim id sesuai yang tersedia (id atau _id)
        const payload = {
          ...form,
          id: editingId,
        };
        await axiosJWT.current.post("/update-task", payload);
        alert("✅ Tugas berhasil diupdate!");
      } else {
        await axiosJWT.current.post("/add-task", form);
        alert("✅ Tugas berhasil ditambahkan!");
      }
      setForm({ title: "", description: "", startDate: "", endDate: "", status: "To Do" });
      setIsUpdate(false);
      setEditingId(null);
      navigate("/mainmenu");
    } catch (err) {
      alert("❌ Gagal menyimpan tugas.");
      console.error("❌ Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ title: "", description: "", startDate: "", endDate: "", status: "To Do" });
    setIsUpdate(false);
    setEditingId(null);
    navigate("/mainmenu");
  };

  useEffect(() => {
    if (editingTask) {
      console.log("🛠 Task yang akan diedit:", editingTask);
    }
  }, [editingTask]);
  useEffect(() => {
    if (editingId) {
      console.log("🛠 ID yang sedang diedit:", editingId);
    }
  }, [editingId]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-6 text-center">
            {isUpdate ? "Edit Tugas" : "Tambah Tugas Baru"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Judul Tugas
              </label>
              <input
                type="text"
                placeholder="Masukkan judul tugas..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi
              </label>
              <textarea
                placeholder="Masukkan deskripsi tugas..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-vertical"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Selesai
                </label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                }`}
              >
                {isLoading
                  ? (isUpdate ? 'Mengupdate...' : 'Menambahkan...')
                  : (isUpdate ? 'Update Tugas' : 'Tambah Tugas')
                }
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                  isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700'
                }`}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
