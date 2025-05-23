import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/utils";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    username: "",
    gender: "",
    birthDate: "",
    picture: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const axiosJWT = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  // Refresh token otomatis
  axiosJWT.interceptors.request.use(
    async (config) => {
      const res = await axios.get(`${BASE_URL}/token`, { withCredentials: true });
      config.headers.Authorization = `Bearer ${res.data.accessToken}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  const fetchProfile = async () => {
    try {
      const res = await axiosJWT.get("/get-profile");
      const data = res.data.response[0];
      setProfile({
        username: data.username || "",
        gender: data.gender || "",
        birthDate: data.birthDate || "",
        picture: data.picture || "",
      });
      setPreview(data.picture || null);
    } catch (err) {
      console.error("Gagal ambil profil:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", profile.username);
    formData.append("gender", profile.gender);
    formData.append("birthDate", profile.birthDate);
    if (selectedFile) formData.append("picture", selectedFile);

    try {
      await axiosJWT.post("/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profil berhasil diperbarui!");
      fetchProfile();
    } catch (err) {
      console.error("Gagal update profil:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Profil</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 shadow rounded">

        <div>
          <label className="block font-medium">Username</label>
          <input
            type="text"
            value={profile.username}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Gender</label>
          <select
            value={profile.gender}
            onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Pilih Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Tanggal Lahir</label>
          <input
            type="date"
            value={profile.birthDate}
            onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Foto Profil</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setSelectedFile(e.target.files[0]);
              setPreview(URL.createObjectURL(e.target.files[0]));
            }}
            className="w-full border p-2 rounded"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded-full"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
