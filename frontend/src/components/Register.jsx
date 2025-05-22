import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { BASE_URL } from '../utils/utils';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState(''); // ← TAMBAH ini
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/register`, {
        username: username,
        password: password,
        confirm_password: confirmPassword,
        date: birthDate,
        gender: gender // ← pastikan dikirim ke backend
      });

      console.log(response);
      navigate("/");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-wrap gap-4 max-w-xl p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-row w-full gap-8 items-center">
          <div className="flex flex-col gap-8">
            <h5 className="text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
              TugasIn
            </h5>
            <h5 className="text-lg font tracking-tight text-gray-900 dark:text-white">
              Catat, Lacak, Selesaikan Proyekmu
            </h5>
          </div>

          <form className="flex flex-col w-sm" onSubmit={register}>
            {error && (
              <div className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800" role="alert">
                <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
                  </svg>
                </div>
                <div className="ms-3 text-sm font-normal">{error}</div>
              </div>
            )}

            <div className="mb-5">
              <label htmlFor="username" className="text-start block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
              <input type="text" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" onChange={(e) => setUsername(e.target.value)} required />
            </div>

            <div className="mb-5">
              <label htmlFor="password" className="text-start block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="mb-5">
              <label htmlFor="passwordConfirmation" className="text-start block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password Confirmation</label>
              <input type="password" id="passwordConfirmation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>

            <label className="text-start block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gender</label>
            <div className="flex items-center ps-4 border border-gray-200 rounded-sm dark:border-gray-700">
              <input id="radio-male" type="radio" value="male" name="gender" onChange={(e) => setGender(e.target.value)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
              <label htmlFor="radio-male" className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Male</label>
            </div>
            <div className="flex items-center ps-4 border border-gray-200 rounded-sm dark:border-gray-700 mb-5">
              <input id="radio-female" type="radio" value="female" name="gender" onChange={(e) => setGender(e.target.value)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
              <label htmlFor="radio-female" className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Female</label>
            </div>

            <label htmlFor="birthDate" className="text-start block mb-2 text-sm font-medium text-gray-900 dark:text-white">Birth Date</label>
            <div className="relative max-w-sm mb-5">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                </svg>
              </div>
              <input id="birthDate" type="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" onChange={(e) => setBirthDate(e.target.value)} required />
            </div>

            <button type="submit" className="text-white bg-green-700 hover:bg-blue-800 focus:ring-4 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700">
              Register
            </button>
          </form>
        </div>

        <div className="w-sm flex flex-col justify-start mx-auto">
          <h1>Already Have an Account?</h1>
          <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700" onClick={() => navigate("/")}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;