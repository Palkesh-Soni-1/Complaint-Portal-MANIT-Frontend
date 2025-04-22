import { useState, useEffect } from "react";
import { Search, X, RefreshCw, User } from "lucide-react";
import Loader from "../../components/Loader";
import { getAllIntermediateAdmins } from "../../services/api/admindata";
import { assignComplaintToAdmin } from "../../services/api/complaint";
import { filterAdminData } from "../../services/filters/intermediateFilters";

export default function AdminModal({
  showModal,
  closeModal,
  selectedComplaint,
  setComplaints,
  setReload,
  reload,
  logout,
}) {
  // Admin selection modal state
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [adminSearchTerm, setAdminSearchTerm] = useState("");
  const [adminFilterDepartment, setAdminFilterDepartment] = useState("all");
  const [departments, setDepartments] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch admins when modal opens
  useEffect(() => {
    if (showModal) {
      getAllIntermediateAdmins({
        setAdminLoading,
        logout,
        setAdmins,
        setFilteredAdmins,
        setDepartments,
        setError,
      });
    }
  }, [showModal, logout]);

  // Filter admins based on search and department
  useEffect(() => {
    if (!admins.length) return;

    filterAdminData({
      admins,
      adminSearchTerm,
      adminFilterDepartment,
      setFilteredAdmins,
    });
  }, [admins, adminSearchTerm, adminFilterDepartment]);

  // Assign complaint to Admin
  const assignToAdmin = async (adminId) => {
    await assignComplaintToAdmin({
      setAdminLoading,
      selectedComplaint,
      adminId,
      setComplaints,
      closeAdminModal: closeModal,
      setReload,
      reload,
    });
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl transform transition-all animate-fadeIn">
        <div className="flex justify-between items-center border-b border-gray-100 px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-800 flex justify-center items-center">
            <User size={20} className="text-blue-600 mr-2" />
            Assign to Administrator
          </h3>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Complaint info */}
          <div className="mb-6 p-5 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
            <h4 className="font-medium text-blue-800 mb-3 flex items-center">
              <span className="bg-blue-200 p-1 rounded-md mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-blue-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </span>
              Complaint Details
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="text-gray-600 font-medium">Number:</div>
              <div className="font-semibold">
                {selectedComplaint?.complaintNumber}
              </div>
              <div className="text-gray-600 font-medium">Student:</div>
              <div className="font-semibold">
                {selectedComplaint?.studentName}
              </div>
              <div className="text-gray-600 font-medium">Type:</div>
              <div className="font-semibold">
                {selectedComplaint?.complaintType}
              </div>
            </div>
          </div>

          {/* Admin search filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-2/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={adminSearchTerm}
                onChange={(e) => setAdminSearchTerm(e.target.value)}
                placeholder="Search by name, email or role..."
                className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-1/3">
              <label className="text-sm text-gray-600 whitespace-nowrap">
                Department:
              </label>
              <select
                value={adminFilterDepartment}
                onChange={(e) => setAdminFilterDepartment(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="all">All Departments</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Admins list */}
          {adminLoading ? (
            <div className="flex justify-center p-8">
              <Loader />
            </div>
          ) : (
            <div className="overflow-y-auto max-h-96 border border-gray-200 rounded-lg shadow-sm">
              {filteredAdmins.length === 0 ? (
                <div className="text-center py-12 text-gray-500 flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-300 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>No administrators match your search criteria</span>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="hidden sm:table-cell px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAdmins.map((admin) => (
                      <tr
                        key={admin._id}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white shadow-sm">
                              {admin.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {admin.fullName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {admin.email || admin.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {admin.role || "Administrator"}
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {admin.department}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => assignToAdmin(admin._id)}
                            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-1.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex justify-center items-center"
                            disabled={adminLoading}
                          >
                            <RefreshCw size={14} className="mr-1" />
                            Assign
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end rounded-b-xl">
          <button
            onClick={closeModal}
            className="bg-gray-200 text-gray-800 py-2 px-5 rounded-md hover:bg-gray-300 transition-colors mr-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
