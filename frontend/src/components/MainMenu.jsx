import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import { BASE_URL } from '../utils/utils';
import axios from 'axios';
import {jwtDecode} from "jwt-decode";

const MainMenu = () => {
    const [token, setToken] = useState("");
    const [expire, setExpire] = useState("");
    const navigate = useNavigate();

    // Membuat instance axios khusus untuk JWT
    const axiosJWT = axios.create({
        baseURL: BASE_URL,
        withCredentials: true,
    });

    // Interceptor akan dijalankan SETIAP KALI membuat request dengan axiosJWT
    // Fungsinya buat ngecek + memperbarui access token sebelum request dikirim
    axiosJWT.interceptors.request.use(
        async (config) => {
        // Ambil waktu sekarang, simpan dalam variabel "currentDate"
        const currentDate = new Date();
        console.log(currentDate);
        // Bandingkan waktu expire token dengan waktu sekarang
        if (expire * 1000 < currentDate.getTime()) {
            // Kalo access token expire, Request token baru ke endpoint /token
            const response = await axios.get(`${BASE_URL}/token`, {
            withCredentials: true   // wajib agar cookie terkirim & diterima
            });
            console.log(response);
            // Update header Authorization dengan access token baru
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;

            // Update token di state
            setToken(response.data.accessToken);

            // Decode token baru untuk mendapatkan informasi user
            const decoded = jwtDecode(response.data.accessToken);
            console.log(decoded);
            
            setExpire(decoded.exp); // <- Set waktu expire baru
        }
        return config;
        },
        (error) => {
        // Kalo misal ada error, langsung balik ke halaman login
        console.log(error);
        setToken("");
        navigate("/");
        }
    );

    const Logout = async () => {
        try {
        await axios.delete(`${BASE_URL}/logout`, {
            withCredentials: true   // wajib agar cookie terkirim & diterima
            });
        navigate("/");
        } catch (error) {
        console.log(error);
        }
    };

    return (
    <div class="h-screen flex justify-center items-center">
        <button type="submit" class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700" onClick={Logout}>Logout</button>
    </div>
    );
};

export default MainMenu;