import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from "../utils/utils";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [user, setUser] = useState({ username: '', gender: '', birthDate: '', picture: ''});

   const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const axiosJWT = useRef(
    axios.create({ baseURL: BASE_URL, withCredentials: true })
  );

  // Set up Axios interceptor
  useEffect(() => {
    const interceptor = axiosJWT.current.interceptors.request.use(
      async (config) => {
        const now = new Date().getTime();
        if (expire && expire * 1000 < now) {
          const response = await axios.get(`${BASE_URL}/token`, { withCredentials: true });
          const newToken = response.data.accessToken;
          config.headers.Authorization = `Bearer ${newToken}`;
          setToken(newToken);
          const decoded = jwtDecode(newToken);
          setExpire(decoded.exp);
          setUser({
            username: decoded.username,
            gender: decoded.gender,
            birthDate: decoded.birthDate,
            picture: decoded.picture
          });
        } else {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        setToken("");
        navigate("/");
        return Promise.reject(error);
      }
    );
    return () => {
      axiosJWT.current.interceptors.request.eject(interceptor);
    };
  }, [expire, token, navigate]);

  // Refresh token saat mount
  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/token`, { withCredentials: true });
        const accessToken = response.data.accessToken;
        setToken(accessToken);
        const decoded = jwtDecode(accessToken);
        setExpire(decoded.exp);
        setUser({
          username: decoded.username,
          gender: decoded.gender,
          birthDate: decoded.birthDate,
          picture: decoded.picture
        });

        setPreview(decoded.picture);
      } catch {
        navigate("/");
      }
    };
    refreshToken();
  }, [navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropSave = async () => {
    const { file, url } = await getCroppedImg(imageSrc, croppedAreaPixels);
    setSelectedFile(file);
    setPreview(url);
    setShowCropper(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("gender", user.gender);
    formData.append("birthDate", user.birthDate);
    if (selectedFile) formData.append("picture", selectedFile);

    try {
      await axiosJWT.current.post("/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profil berhasil diperbarui!")
      navigate("/mainmenu")
    } catch (err) {
      console.error("Gagal update profil:", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Profil</h1>

      {showCropper && (
        <div className="fixed inset-0 bg-black/25  z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-[90vw] max-w-md">
            <div className="relative w-full h-64 bg-gray-200">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, area) => setCroppedAreaPixels(area)}
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => setShowCropper(false)}
              >
                Batal
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleCropSave}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 shadow rounded">

        <div className="flex flex-col items-center gap-4">
          <label className="block font-medium">Foto Profil</label>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded-full"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Username</label>
          <input
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Gender</label>
          <select
            value={user.gender}
            onChange={(e) => setUser({ ...user, gender: e.target.value })}
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
            value={user.birthDate}
            onChange={(e) => setUser({ ...user, birthDate: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded me-4"
        >
          Simpan Perubahan
        </button>
        <button
          type="button"
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          onClick={()=>{navigate("/mainmenu")}}
        >
          Batal
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
