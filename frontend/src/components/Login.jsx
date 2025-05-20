import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/login`, {
        username: username,
        password: password,
      }, {
        withCredentials: true   // wajib agar cookie terkirim & diterima
        });

      console.log(response);

      // Kalo berhasil login
      navigate("/notes");   
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div class="h-screen flex justify-center items-center">
        <div class="flex flex-wrap gap-4 max-w-xl p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div class="flex flex-row w-full gap-8">
                <div class="flex items-center">
                    <h5 class="text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                        TugasIn
                    </h5>
                </div>

                <form class="flex flex-col w-sm">
                <div class="mb-5">
                    <label for="email" class="text-start block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                    <input type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Username" required />
                </div>

                <div class="mb-5">
                    <label for="password" class="text-start block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <input type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Password" required />
                </div>

                <div class="flex items-start mb-5">
                    <div class="flex items-center h-5">
                    <input id="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required />
                    </div>
                    <label for="remember" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                </div>

                <button type="submit" class="text-white bg-green-700 hover:bg-blue-800 focus:ring-4 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700">Submit</button>
                </form>
            </div>
            <div class="w-sm flex flex-col justify-start mx-auto">
                <h1>Doesnt Have an Account Yet?</h1>
                <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700" onClick={()=>{navigate("/register")}}>Register</button>
            </div>
        </div>
    </div>
  );
};

export default LoginForm;