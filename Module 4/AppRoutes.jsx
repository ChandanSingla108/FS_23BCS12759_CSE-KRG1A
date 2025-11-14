import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard'; // Team Dashboard
import ManagerDashboard from '../pages/ManagerDashboard';
import ProjectDetail from '../pages/ProjectDetail';
import Chat from '../pages/Chat';
import ProjectList from "../pages/ProjectList";
import ManageTeams from "../pages/ManageTeams";
import MyProjects from "../pages/MyProjects";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* ✅ Team Member Dashboard */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ Manager Dashboard */}
        <Route
          path="manager-dashboard"
          element={
            <ProtectedRoute>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="projects"
          element={
            <ProtectedRoute>
              <ProjectList />
            </ProtectedRoute>
          }
        />

        <Route
          path="manage-teams"
          element={
            <ProtectedRoute>
              <ManageTeams />
            </ProtectedRoute>
          }
        />

        <Route
          path="projects/:projectId"
          element={
            <ProtectedRoute>
              <ProjectDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-projects"
          element={
            <ProtectedRoute>
              <MyProjects />
            </ProtectedRoute>
          }
        />
                <Route
          path="chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

      </Route>
    </Routes>
  );
}
