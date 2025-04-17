import React from "react";
import {Routes, Route,Navigate } from "react-router-dom";
import Layout from "./Layout/Layout";

import Home from "./pages/students/Home";
import Login from "./pages/Login";
import Profile from "./pages/students/Profile";
import Complaint from "./pages/students/Complaint";
import ComplaintViewPage from "./pages/students/ComplaintViewPage";

import AdminDashboard from "./pages/admins/AdminDashboard";
import AdminManageComplaints from "./pages/admins/AdminManageComplaints";

import SuperAdminProfile from "./pages/superAdmin/SuperAdminProfile";
import AdminList from "./pages/superAdmin/AdminList";

import Loader from "./components/Loader";
import { useAuth } from "./context/AuthContext";
import { useData } from "./context/DataContext";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<AuthenticatedRoute />} />

        {/* Student Routes */}
        <Route
          path="/student/home"
          element={
            <ProtectedRoute role="student">
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute role="student">
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/complaint"
          element={
            <ProtectedRoute role="student">
              <Complaint />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/complaints/:complaintNumber"
          element={
            <ProtectedRoute role="student">
              <ComplaintViewPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute role="admin">
              <AdminManageComplaints />
            </ProtectedRoute>
          }
        />

        {/* SuperAdmin Routes */}
        <Route
          path="/superadmin/admins"
          element={
            <ProtectedRoute role="superadmin">
              <AdminList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin/profile"
          element={
            <ProtectedRoute role="superadmin">
              <SuperAdminProfile />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/*" element={<CatchAllRoutes />}></Route>
    </Routes>
  );
};

const AuthenticatedRoute = () => {
  const { auth } = useAuth();
  return !auth ? <Login /> : <RedirectBasedOnRole />;
};

const CatchAllRoutes = () => {
  return <RedirectBasedOnRole />;
};

const RedirectBasedOnRole = () => {
  const { auth, logout, isLoading } = useAuth();
  const {isLoadingData} =useData();
  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-3xl bg-transparent font-bold text-gray-700">
        <Loader />
      </div>
    );
  }
  if (!auth) return <Login />;
  if (auth?.role === "student") {
    return <Navigate to="/student/home" replace />;
  } else if (auth?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (auth?.role === "superadmin") {
    return <Navigate to="/superadmin/admins" replace />;
  } else {
    logout();
    return <Login />;
  }
};

const ProtectedRoute = ({ role, children }) => {
  const { auth,logout, isLoading } = useAuth();
  const {isLoadingData}=useData();
  if (isLoading||isLoadingData) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-3xl bg-transparent font-bold text-gray-700">
        <Loader/>
      </div>
    );
  }

  if (!auth || auth?.role !== role) {
    logout();
    return <Login />;
  }

  return children;
};

export default App;
