import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import LoginForm from './components/Login';
import RegisterForm from './components/Register';
import MainMenu from './components/MainMenu';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm/>}/>
        <Route path="/register" element={<RegisterForm/>}/>
        <Route path="/mainmenu" element={<MainMenu/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
