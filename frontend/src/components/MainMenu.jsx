import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from '../utils/utils';
import { FaBars, FaUserCircle, FaSignOutAlt, FaPlus, FaAddressCard } from 'react-icons/fa';

const MainMenu = () => {
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [user, setUser] = useState({ username: '', gender: '', birthDate: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const axiosJWT = useRef(axios.create({ baseURL: BASE_URL, withCredentials: true }));

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/token`, { withCredentials: true });
        const decoded = jwtDecode(response.data.accessToken);
        setToken(response.data.accessToken);
        setExpire(decoded.exp);
        setUser({ username: decoded.username, gender: decoded.gender, birthDate: decoded.birthDate });
        fetchTasks();
      } catch {
        navigate("/");
      }
    };
    refreshToken();
    // eslint-disable-next-line
  }, [navigate]);

  useEffect(() => {
    const interceptor = axiosJWT.current.interceptors.request.use(
      async (config) => {
        const now = new Date().getTime();
        if (expire * 1000 < now) {
          const response = await axios.get(`${BASE_URL}/token`, { withCredentials: true });
          config.headers.Authorization = `Bearer ${response.data.accessToken}`;
          setToken(response.data.accessToken);
          const decoded = jwtDecode(response.data.accessToken);
          setExpire(decoded.exp);
          setUser({ username: decoded.username, gender: decoded.gender, birthDate: decoded.birthDate });
        } else {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        navigate("/");
        return Promise.reject(error);
      }
    );
    return () => {
      axiosJWT.current.interceptors.request.eject(interceptor);
    };
  }, [expire, token, navigate]);

  const fetchTasks = async () => {
    try {
      const res = await axiosJWT.current.get("/get-all-task");
      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const Logout = async () => {
    await axios.delete(`${BASE_URL}/logout`, { withCredentials: true });
    navigate("/");
  };

  const handleDelete = async (id) => {
    if (!id) {
      alert("❌ ID tugas tidak ditemukan!");
      return;
    }
    try {
      await axiosJWT.current.delete(`/delete-task?id=${id}`);
      fetchTasks();
    } catch (error) {
      console.error("❌ Gagal hapus tugas:", error);
      alert("❌ Gagal hapus tugas.");
    }
  };

  const handleEdit = (task) => {
    navigate('/task', { state: { task } });
  };

  // Tentukan sapaan berdasarkan gender
  const getSalutation = () => {
    if (user.gender?.toLowerCase() === "male" || user.gender?.toLowerCase() === "laki-laki") {
      return `Mr. ${user.username}`;
    } else if (user.gender?.toLowerCase() === "female" || user.gender?.toLowerCase() === "perempuan") {
      return `Mrs. ${user.username}`;
    } else {
      return user.username || "-";
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-200 relative">
      {/* Hamburger Button */}
      <button
        className="fixed top-4 left-4 z-50 text-3xl text-black bg-white rounded-md p-2 shadow"
        onClick={() => setSidebarOpen(true)}
      >
        <FaBars />
      </button>

      {/* Sidebar Drawer */}
      <div className={`fixed top-0 left-0 z-50 h-full w-64 bg-blue-800 text-white p-6 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button
          className="absolute top-4 right-4 text-2xl text-white"
          onClick={() => setSidebarOpen(false)}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Tugasin</h2>
        <div className="flex flex-col items-center gap-2 mb-6">
          <FaUserCircle size={64} />
          <p className="font-semibold text-lg">Profile</p>
          <p>Nama: {user.username || '-'}</p>
          <p>Gender: {user.gender || '-'}</p>
          <p>Tanggal Lahir: {user.birthDate || '-'}</p>
        </div>
        <button onClick={()=>{}} className="flex items-center gap-2 text-white font-semibold hover:text-red-300">
          <FaAddressCard /> Edit Profile
        </button>
        <button onClick={Logout} className="flex items-center gap-2 text-white font-semibold hover:text-red-300">
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Main Content Full Width */}
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold mb-4">Welcome! {getSalutation()}</h1>
        <h2 className="text-xl font-semibold mb-4">Tugas Anda</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task, index) => {
            let boxColor = "bg-gray-200";
            if (task.status === "In Progress") boxColor = "bg-yellow-200";
            else if (task.status === "Done") boxColor = "bg-green-200";
            return (
              <div key={index} className={`${boxColor} p-4 rounded-lg shadow`}>
                <h3 className="font-bold text-lg mb-2">{task.title}</h3>
                <p>{task.description}</p>
                <ul className="text-sm mt-2">
                  <li><strong>Status:</strong> {task.status}</li>
                  <li><strong>Mulai:</strong> {task.startDate}</li>
                  <li><strong>Deadline:</strong> {task.endDate}</li>
                </ul>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleEdit(task)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(task.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Hapus</button>
                </div>
              </div>
            );
          })}

          <div
            onClick={() => navigate('/task')}
            className="cursor-pointer bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex justify-center items-center gap-2"
          >
            <FaPlus /> Tambah Tugas
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
