import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layouts/mainlayout"
import HomePage from "./pages/home/home"
import LoginPage from "./pages/auth/login"
import ForgotPassword from  "./pages/auth/forget-password"
import AdminDashboard from "./pages/dashboard/adminDashboard"
import TeacherDashboard from "./pages/dashboard/teacherDashboard"
import ProfilePage from "./pages/profile/profile.jsx"
import ProtectedRoute from "./components/protectedRoute.jsx";

import ResetPasswordPage from "./pages/auth/reset-password"


function App() {
  

  return (
    <Routes>
      <Route element={<MainLayout/>}>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/reset-password/:token" element={<ResetPasswordPage/>}/>
     
      <Route path="/profile" element={<ProfilePage/>}/>
   </Route>

   <Route element={<ProtectedRoute />}>
  <Route path="/adminDashboard" element={<AdminDashboard/>}/>
  <Route path="/teacherDashboard" element={<TeacherDashboard/>}/>
</Route>

    </Routes>
  )
}


export default App
