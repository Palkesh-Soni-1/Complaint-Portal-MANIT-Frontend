import { useState, useEffect } from "react";
import { Search } from "lucide-react";
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
      reload
    });
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h3 className="text-xl font-semibold">Assign to Administrator</h3>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Complaint info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-md">
            <h4 className="font-medium mb-2">Complaint Details</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="text-gray-600">Number:</div>
              <div>{selectedComplaint?.complaintNumber}</div>
              <div className="text-gray-600">Student:</div>
              <div>{selectedComplaint?.studentName}</div>
              <div className="text-gray-600">Type:</div>
              <div>{selectedComplaint?.complaintType}</div>
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
                placeholder="Search admins..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-1/3">
              <label className="text-sm text-gray-600">Department:</label>
              <select
                value={adminFilterDepartment}
                onChange={(e) => setAdminFilterDepartment(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-2 text-sm w-full"
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
            <div className="overflow-y-auto max-h-96 border border-gray-200 rounded-md">
              {filteredAdmins.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No administrators match your search criteria
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAdmins.map((admin) => (
                      <tr key={admin._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
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
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {admin.department}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => assignToAdmin(admin._id)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                            disabled={adminLoading}
                          >
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

        <div className="bg-gray-50 px-6 py-4 flex justify-end rounded-b-lg">
          <button
            onClick={closeModal}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors mr-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
