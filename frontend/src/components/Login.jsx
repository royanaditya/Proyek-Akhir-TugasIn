import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { BASE_URL } from '../utils/utils';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        username: username,
        password: password,
      }, {
        withCredentials: true   // wajib agar cookie terkirim & diterima
        });

      console.log(response);

      // Kalo berhasil login
      navigate("/mainmenu");   
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div class="h-screen flex justify-center items-center">
        <div class="flex flex-wrap gap-4 max-w-xl p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div class="flex flex-row w-full gap-8 items-center">
                <div class="flex flex-col gap-8">
                    <h5 class="text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                        TugasIn
                    </h5>
                    <h5 class="text-lg font tracking-tight text-gray-900 dark:text-white">
                        Catat, Lacak, Selesaikan Proyekmu
                    </h5>
                </div>

                <form class="flex flex-col w-sm" onSubmit={login}>

                  {error && (
                      <div id="toast-danger" class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800" role="alert">
                          <div class="inline-flex items-center justify-center shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                              <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
                              </svg>
                              <span class="sr-only">Error icon</span>
                          </div>
                          <div class="ms-3 text-sm font-normal">{error}</div>
                          <button type="button" class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-danger" aria-label="Close">
                              <span class="sr-only">Close</span>
                              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                              </svg>
                          </button>
                      </div>
                  )}

                  <div class="mb-5">
                      <label for="email" class="text-start block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                      <input type="text" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                  </div>

                  <div class="mb-5">
                      <label for="password" class="text-start block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
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