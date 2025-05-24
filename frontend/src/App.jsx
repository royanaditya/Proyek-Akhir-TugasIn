import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import LoginForm from './components/Login';
import RegisterForm from './components/Register';
import MainMenu from './components/MainMenu';
import TaskPage from './components/TaskPage'; 
import ProfilePage from "./components/ProfilePage";
import TaskDetail from './components/TaskDetail';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm/>}/>
        <Route path="/register" element={<RegisterForm/>}/>
        <Route path="/mainmenu" element={<MainMenu/>}/>
        <Route path="/task" element={<TaskPage />} />
        <Route path="/edit-profile" element={<ProfilePage />} />
        <Route path="/task-detail" element={<TaskDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
