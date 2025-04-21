import React from "react";
import {Routes, Route,Navigate } from "react-router-dom";

// Global ----------------------------------------------------
import Layout from "./Layout/Layout";
import Login from "./pages/Login";
import Loader from "./components/Loader";

// Student Screens -------------------------------------------
import Home from "./pages/students/Home";
import Profile from "./pages/students/Profile";
import Complaint from "./pages/students/Complaint";
import ComplaintViewPage from "./pages/students/ComplaintViewPage";

// Admin Screens ---------------------------------------------
import AdminDashboard from "./pages/admins/AdminDashboard";
import AdminManageComplaints from "./pages/admins/AdminManageComplaints";

// Intermediate Screens --------------------------------------
import IntermediateManageComplaints from "./pages/intermediate/IntermediateManageComplaints";

// Superadmin Screens ----------------------------------------
import SuperAdminProfile from "./pages/superAdmin/SuperAdminProfile";
import AdminList from "./pages/superAdmin/AdminList";
import IntermediateList from "./pages/superAdmin/IntermediateList";

// Context ----------------------------------------------------
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
          path="/student/complaints/:complaintId"
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

        {/* Intermediate Routes */}
        <Route
          path="/intermediate/complaints"
          element={
            <ProtectedRoute role="intermediate">
              <IntermediateManageComplaints />
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
          path="/superadmin/intermediates"
          element={
            <ProtectedRoute role="superadmin">
              <IntermediateList />
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
  return !auth.isAuthenticated ? <Login /> : <RedirectBasedOnRole />;
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
  if (!auth.isAuthenticated) return <Login />;
  if (auth?.role === "student") {
    return <Navigate to="/student/home" replace />;
  } else if (auth?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (auth?.role === "superadmin") {
    return <Navigate to="/superadmin/admins" replace />;
  } else if (auth?.role === "intermediate") {
    return <Navigate to="/intermediate/complaints" replace />;
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

  if (!auth.isAuthenticated || auth?.role !== role) {
    logout();
    return <Login />;
  }

  return children;
};

export default App;
