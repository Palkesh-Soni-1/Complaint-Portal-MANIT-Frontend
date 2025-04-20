import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronRight,
  Check,
  Clock,
  AlertCircle,
  UserCheck,
  X,
} from "lucide-react";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";

export default function IntermediateManageComplaints() {
  const { logout } = useAuth();

  // State management
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(false);

  // Filters state
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  // Admin selection modal state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [adminSearchTerm, setAdminSearchTerm] = useState("");
  const [adminFilterDepartment, setAdminFilterDepartment] = useState("all");
  const [departments, setDepartments] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [adminLoading, setAdminLoading] = useState(false);

  // Rejection modal state
  const [rejectionFeedback, setRejectionFeedback] = useState("");

  // Constants
  const complaintTypes = [
    "Academic",
    "Hostel",
    "Scholarship",
    "Medical",
    "Department",
    "Sports",
    "Ragging",
  ];

  // Fetch all complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${import.meta.env.VITE_SITE}/complaint/get/open`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            logout();
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const res = await response.json();
        // console.log(res);
        setComplaints(res.data);
        setFilteredComplaints(res.data);
      } catch (err) {
        setError(`Failed to fetch complaints: ${err.message}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [logout, reload]);

  // Apply filters to complaints
  useEffect(() => {
    const filtered = Array.isArray(complaints)
      ? complaints.filter((complaint) => {
          const matchesStatusFilter =
            statusFilter === "all" || complaint.status === statusFilter;
          const matchesTypeFilter =
            typeFilter === "all" || complaint.complaintType === typeFilter;
          const matchesSearch =
            complaint.complaintNumber
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            complaint.description
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            complaint.studentName
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            complaint.studentId
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase());

          let matchesDateFilter = true;
          if (dateFilter.startDate && dateFilter.endDate) {
            const startDate = new Date(dateFilter.startDate);
            const endDate = new Date(dateFilter.endDate);
            const complaintDate = new Date(complaint.dateReported);
            matchesDateFilter =
              complaintDate >= startDate && complaintDate <= endDate;
          }

          return (
            matchesStatusFilter &&
            matchesTypeFilter &&
            matchesSearch &&
            matchesDateFilter
          );
        })
      : [];

    setFilteredComplaints(filtered);
  }, [
    complaints,
    statusFilter,
    typeFilter,
    searchTerm,
    dateFilter.startDate,
    dateFilter.endDate,
  ]);

  // Fetch admins when needed
  const fetchAdmins = async () => {
    try {
      setAdminLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_SITE}/intermediate/admins`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          logout();
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setAdmins(data);
      setFilteredAdmins(data);

      // Extract unique departments
      const uniqueDepartments = [
        ...new Set(data.map((admin) => admin.department)),
      ];
      setDepartments(uniqueDepartments);
    } catch (err) {
      setError(`Failed to fetch admins: ${err.message}`);
      console.error(err);
    } finally {
      setAdminLoading(false);
    }
  };

  // Filter admins based on search and department
  useEffect(() => {
    if (!admins.length) return;

    let results = admins;

    if (adminSearchTerm) {
      const lowercasedSearch = adminSearchTerm.toLowerCase();
      results = results.filter(
        (admin) =>
          admin.fullName.toLowerCase().includes(lowercasedSearch) ||
          admin.username.toLowerCase().includes(lowercasedSearch) ||
          admin.email?.toLowerCase().includes(lowercasedSearch) ||
          admin.role?.toLowerCase().includes(lowercasedSearch)
      );
    }

    if (adminFilterDepartment !== "all") {
      results = results.filter(
        (admin) => admin.department === adminFilterDepartment
      );
    }

    // Only include active admins
    results = results.filter((admin) => admin.isActive);

    setFilteredAdmins(results);
  }, [admins, adminSearchTerm, adminFilterDepartment]);

  // Handler functions
  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setTypeFilter("all");
    setDateFilter({
      startDate: "",
      endDate: "",
    });
    setSearchTerm("");
  };

  const handleDateFilterChange = (field, value) => {
    setDateFilter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAssign = (complaint) => {
    setSelectedComplaint(complaint);
    setShowAdminModal(true);
    fetchAdmins();
  };

  const handleReject = (complaint) => {
    setSelectedComplaint(complaint);
    if (!window.confirm("Are you sure you want to reject this complaint?")) {
      return;
    }
    rejectComplaint();
  };

  const closeAdminModal = () => {
    setShowAdminModal(false);
    setAdminSearchTerm("");
    setAdminFilterDepartment("all");
  };

  const assignToAdmin = async (adminId) => {
    try {
      setAdminLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_SITE}/complaint/intermediate/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            complaintId: selectedComplaint._id,
            status: "assigned",
            adminId: adminId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Update local state
      setComplaints((prevComplaints) =>
        prevComplaints.map((c) =>
          c._id === selectedComplaint._id
            ? { ...c, status: "assigned", assigned: true, assignedTo: adminId }
            : c
        )
      );

      closeAdminModal();
      setReload(!reload);
    } catch (err) {
      setError(`Failed to assign complaint: ${err.message}`);
      console.error(err);
    } finally {
      setAdminLoading(false);
    }
  };

  const rejectComplaint = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_SITE}/complaint/intermediate/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            complaintId: selectedComplaint._id,
            status: "rejected",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Update local state
      setComplaints((prevComplaints) =>
        prevComplaints.map((c) =>
          c._id === selectedComplaint._id ? { ...c, status: "rejected" } : c
        )
      );
    } catch (err) {
      setError(`Failed to reject complaint: ${err.message}`);
      console.error(err);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Status badge component
  const getStatusBadge = (status) => {
    switch (status) {
      case "resolved":
        return (
          <div className="bg-green-200 text-green-800 px-3 py-1 rounded-full whitespace-nowrap flex items-center gap-1 text-xs md:text-sm md:px-4">
            <Check size={14} />
            <span className="xs:inline">Resolved</span>
          </div>
        );
      case "open":
        return (
          <div className="bg-red-500 text-white px-3 py-1 rounded-full whitespace-nowrap flex items-center gap-1 text-xs md:text-sm md:px-4">
            <AlertCircle size={14} />
            <span className="xs:inline">Open</span>
          </div>
        );
      case "processing":
        return (
          <div className="bg-yellow-300 text-yellow-800 px-3 py-1 rounded-full whitespace-nowrap flex items-center gap-1 text-xs md:text-sm md:px-4">
            <Clock size={14} />
            <span className="xs:inline">Processing</span>
          </div>
        );
      case "assigned":
        return (
          <div className="bg-blue-300 text-blue-800 px-3 py-1 rounded-full whitespace-nowrap flex items-center gap-1 text-xs md:text-sm md:px-4">
            <UserCheck size={14} />
            <span className="xs:inline">Assigned</span>
          </div>
        );
      case "rejected":
        return (
          <div className="bg-gray-300 text-gray-800 px-3 py-1 rounded-full whitespace-nowrap flex items-center gap-1 text-xs md:text-sm md:px-4">
            <X size={14} />
            <span className="xs:inline">Rejected</span>
          </div>
        );
      default:
        return (
          <div className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full whitespace-nowrap text-xs md:text-sm md:px-4">
            {status}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto my-4 md:my-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 md:p-4 rounded-t-lg">
        <h2 className="text-lg md:text-xl text-center md:text-left font-bold text-gray-100">
          Manage Complaints
        </h2>
      </div>
      {/* Search and Filter */}
      <div className="py-3 md:py-4 flex max-lg:flex-col flex-row max-lg:gap-2 gap-0 sm:justify-between bg-transparent">
        <div className="relative w-full lg:w-2/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search complaints..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex space-x-2">
          <button
            className="flex items-center justify-center gap-2 text-sm bg-white border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50"
            onClick={toggleFilters}
          >
            <Filter size={16} />
            <span className="hidden sm:inline">Filters</span>
            <ChevronRight
              size={16}
              className={`transform transition-transform ${
                isFilterOpen ? "rotate-90" : "rotate-0"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg overflow-hidden shadow-md">
        {/* Filters Panel */}
        <div
          className={`border-b border-blue-100 transition-all duration-300 overflow-hidden ${
            isFilterOpen ? "max-h-full" : "max-h-0"
          }`}
        >
          <div className="p-4">
            <div className="flex flex-col gap-4">
              <h2 className="text-sm font-medium flex items-center gap-2">
                <Filter size={16} className="text-blue-500" />
                Filter Your Search
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="status" className="text-sm text-gray-600">
                    Status:
                  </label>
                  <select
                    id="status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-2 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="assigned">Assigned</option>
                    <option value="processing">Processing</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="type" className="text-sm text-gray-600">
                    Type:
                  </label>
                  <select
                    id="type"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-2 text-sm"
                  >
                    <option value="all">All Types</option>
                    {complaintTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600">From:</label>
                  <input
                    type="date"
                    value={dateFilter.startDate}
                    onChange={(e) =>
                      handleDateFilterChange("startDate", e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-2 py-2 text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600">To:</label>
                  <input
                    type="date"
                    value={dateFilter.endDate}
                    onChange={(e) =>
                      handleDateFilterChange("endDate", e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-2 py-2 text-sm"
                  />
                </div>
              </div>

              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 mb-3 hover:text-blue-800 underline self-start"
              >
                Clear Filters
              </button>
            </div>

            {/* Active filters tags */}
            {(statusFilter !== "all" ||
              typeFilter !== "all" ||
              dateFilter.startDate ||
              dateFilter.endDate) && (
              <div className="mt-3 flex items-center flex-wrap gap-2">
                <span className="text-xs text-gray-500">Active filters:</span>

                {statusFilter !== "all" && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Status: {statusFilter}
                  </span>
                )}

                {typeFilter !== "all" && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Type: {typeFilter}
                  </span>
                )}

                {dateFilter.startDate && dateFilter.endDate && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Date: {dateFilter.startDate} - {dateFilter.endDate}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
          </div>
        )}

        {/* Complaints List */}
        <div>
          {/* Mobile View */}
          <div className="sm:hidden">
            {filteredComplaints.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No complaints match your filter criteria
              </div>
            ) : ( Array.isArray(filteredComplaints) &&
              filteredComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="border-b border-blue-100 p-3 hover:bg-blue-50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-blue-600 font-medium">
                      {complaint.complaintNumber}
                    </div>
                    <div>{getStatusBadge(complaint.status)}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-600">Student:</div>
                    <div className="font-medium">{complaint.studentName}</div>
                    <div className="text-gray-600">ID:</div>
                    <div>{complaint.studentId}</div>
                    <div className="text-gray-600">Type:</div>
                    <div className="text-blue-800 font-medium">
                      {complaint.complaintType}
                    </div>
                    <div className="text-gray-600">Date:</div>
                    <div>{formatDate(complaint.dateReported)}</div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {/* Only show action buttons for open complaints */}
                    {complaint.status === "open" && (
                      <>
                        <button
                          onClick={() => handleAssign(complaint)}
                          className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
                        >
                          Assign
                        </button>
                        <button
                          onClick={() => handleReject(complaint)}
                          className="text-xs bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop View */}
          <div className="hidden sm:block">
            <div className="hidden md:grid md:grid-cols-6 border-t border-b border-blue-300 bg-white text-sm">
              <div className="font-medium p-3 md:p-4">Complaint No.</div>
              <div className="font-medium p-3 md:p-4">Student Details</div>
              <div className="font-medium p-3 md:p-4">Type</div>
              <div className="font-medium p-3 md:p-4">Date</div>
              <div className="font-medium p-3 md:p-4">Status</div>
              <div className="font-medium p-3 md:p-4">Actions</div>
            </div>

            {filteredComplaints.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No complaints match your filter criteria
              </div>
            ) : (Array.isArray(filteredComplaints) &&
              filteredComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="grid grid-cols-6 border-b border-blue-300 text-sm hover:bg-blue-50"
                >
                  <div className="p-3 md:p-4 text-blue-600">
                    {complaint.complaintNumber}
                  </div>
                  <div className="p-3 md:p-4">
                    <div className="font-medium">{complaint.studentName}</div>
                    <div className="text-xs text-gray-500">
                      {complaint.studentId}
                    </div>
                    <div className="text-xs text-gray-500">
                      {complaint.hostelNumber
                        ? `${complaint.hostelNumber} - ${complaint.roomNumber}`
                        : "N/A"}
                    </div>
                  </div>
                  <div className="p-3 md:p-4">
                    <div className="text-blue-800 font-medium">
                      {complaint.complaintType}
                    </div>
                    {complaint.complaintSubType && (
                      <div className="text-xs px-2 py-0.5 bg-gray-100 rounded-full inline-block mt-1">
                        {complaint.complaintSubType}
                      </div>
                    )}
                  </div>
                  <div className="p-3 md:p-4 text-gray-600">
                    {formatDate(complaint.dateReported)}
                  </div>
                  <div className="p-3 md:p-4">
                    {getStatusBadge(complaint.status)}
                    {complaint.assignedTo &&
                      complaint.status === "assigned" && (
                        <div className="text-xs text-gray-500 mt-1">
                          Assigned to admin
                        </div>
                      )}
                  </div>
                  <div className="p-3 md:p-4">
                    {complaint.status === "open" ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAssign(complaint)}
                          className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded flex items-center gap-1"
                        >
                          <UserCheck size={12} />
                          Assign
                        </button>
                        <button
                          onClick={() => handleReject(complaint)}
                          className="text-xs bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded flex items-center gap-1"
                        >
                          <X size={12} />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">
                        {complaint.status === "rejected"
                          ? "Rejected"
                          : complaint.status === "assigned"
                          ? "Assigned to admin"
                          : "Being handled"}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination or results summary */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">{filteredComplaints.length}</span> of{" "}
            <span className="font-medium">{complaints.length}</span> complaints
          </div>
        </div>
      </div>
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-semibold">Assign to Administrator</h3>
              <button
                onClick={closeAdminModal}
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
                onClick={closeAdminModal}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors mr-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
