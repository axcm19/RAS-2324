import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from "./pages/Login"
import Register from "./pages/Register"
import TestAnswering from "./pages/TestAnswering"
import TestSelector from "./pages/TestSelectionTeacher"
import TestCorrection from "./pages/TestCorrection"
import TestCorrectionSingle from "./pages/TestCorrectionSingle"
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import RouterGuard from "./components/RouterGuard";
import TecnicoDashboard from './pages/TecnicoDashboard';
import NoPage from './pages/NoPage';
import Home from './pages/Home';
import ClassroomPage from './pages/ClassroomPage';
import TestView from './pages/TestView';

import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<RouterGuard><Home /></RouterGuard>} />
        <Route path="/test-answering/:testId" element={<TestAnswering />} />
        <Route path="test-correction/:testId" element={<TestCorrection />} />
        <Route path="test-correction/:testId/:studentId" element={<TestCorrectionSingle />} />
        <Route path="test-view/:testId/:studentId" element={<TestView />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

