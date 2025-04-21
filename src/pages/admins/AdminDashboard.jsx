import { useEffect, useState } from "react";
import {
  PieChart,
  ResponsiveContainer,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";
import { NavLink } from "react-router-dom";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";
import { fetchAssignedComplaints } from "../../services/api/complaint";
import getStatusBadge from "../../components/getStatusBadge";
function AdminDashboard() {
  const { complaints, setComplaints, auth } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAssignedComplaints({setIsLoading,setComplaints, adminId:auth?.userData?.id});
  }, []);

  const totalComplaints = complaints.length;
  const assignedComplaints = complaints.filter((c) => c.status === "assigned").length;
  const processingComplaints = complaints.filter(
    (c) => c.status === "processing"
  ).length;
  const resolvedComplaints = complaints.filter(
    (c) => c.status === "resolved"
  ).length;

  const recentComplaints = [...complaints]
    .slice(0, 5);

  const pieData = [
    { name: "Assigned", value: assignedComplaints, color: "#3B82F6" },
    { name: "Processing", value: processingComplaints, color: "#F59E0B" },
    { name: "Resolved", value: resolvedComplaints, color: "#10B981" },
  ];

  return (
    <div className="max-w-[1100px] mx-auto min-h-[70vh] py-5 px-2">
      {isLoading ? (
        <div className="min-h-[70vh] flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 my-4 md:p-4 rounded-t-lg">
            <h2 className="text-lg md:text-xl text-center md:text-left font-bold text-gray-100">
              Admin Dashboard
            </h2>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-600">Total</h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {totalComplaints}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 text-red-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-600">Assigned</h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {assignedComplaints}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-600">
                    Processing
                  </h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {processingComplaints}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-600">
                    Resolved
                  </h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {resolvedComplaints}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Recent Complaints */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Chart */}
            <div className="bg-white rounded-lg shadow p-6 max-sm:hidden">
              <h3 className="sm:text-lg font-medium text-gray-700 mb-4">
                Complaint Status Overview
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Complaints */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-700">
                  Recent Complaints
                </h3>
                <NavLink
                  to="/admin/complaints"
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  View All
                </NavLink>
              </div>

              <div className="space-y-4">
                {recentComplaints.map((complaint) => (
                  <div
                    key={complaint._id}
                    className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium text-gray-800">
                        {complaint.complaintNumber}
                      </h4>
                      {getStatusBadge(complaint.status)}
                    </div>
                    <div className="mt-1">
                      <p className="text-sm text-gray-600 truncate">
                        {complaint.description}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                          {complaint.complaintType}
                        </span>
                        {complaint.hostelNumber && (
                          <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full ml-2">
                            {complaint.hostelNumber} - Room{" "}
                            {complaint.roomNumber}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>
                        {complaint.studentName} ({complaint.studentId})
                      </span>
                      <span>{complaint.dateReported}</span>
                    </div>
                  </div>
                ))}

                {recentComplaints.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No complaints found
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
