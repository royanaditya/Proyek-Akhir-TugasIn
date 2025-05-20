import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import LoginForm from './components/Login';
import RegisterForm from './components/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm/>}/>
        <Route path="/register" element={<RegisterForm/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
