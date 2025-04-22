import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronRight,
  UserCheck,
  X,
  CheckSquare,
  Square,
  RefreshCw,
} from "lucide-react";
import getStatusBadge from "../../components/getStatusBadge";
import Loader from "../../components/Loader";
import AdminModal from "../../components/Intermediate/AdminModal";
import { useAuth } from "../../context/AuthContext";
import {
  getOpenComplaints,
  intermediateRejectComplaint,
  intermediateBulkRejectComplaints,
} from "../../services/api/complaint";
import { formatDate } from "../../utils";
import { filterIntermediateComplaints } from "../../services/filters/intermediateFilters";
import BulkAdminModal from "../../components/Intermediate/BulkAdminModal";

export default function IntermediateManageComplaints() {
  const { logout } = useAuth();

  // State management ---------------------------------------
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(false);

  // Bulk selection state ---------------------------------
  const [selectedComplaints, setSelectedComplaints] = useState([]);
  const [bulkActionInProgress, setBulkActionInProgress] = useState(false);
  const [showBulkAssignModal, setShowBulkAssignModal] = useState(false);

  // Filters state ------------------------------------------
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  // Admin selection modal state ------------------------------
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Constants ------------------------------------------------
  const complaintTypes = [
    "Academic",
    "Hostel",
    "Scholarship",
    "Medical",
    "Department",
    "Sports",
    "Ragging",
  ];

  // Fetch all open complaints -------------------------------------------
  useEffect(() => {
    getOpenComplaints({
      setLoading,
      setError,
      logout,
      setComplaints,
      setFilteredComplaints,
    });
  }, [logout, reload]);

  // Apply filters to complaints ------------------------------------------
  useEffect(() => {
    const filtered = filterIntermediateComplaints({
      complaints,
      statusFilter,
      typeFilter,
      dateFilter,
      searchTerm,
    });

    setFilteredComplaints(filtered);
    // Clear selection when filters change
    setSelectedComplaints([]);
  }, [
    complaints,
    statusFilter,
    typeFilter,
    searchTerm,
    dateFilter.startDate,
    dateFilter.endDate,
  ]);

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
  };

  const handleReject = (complaint) => {
    if (!window.confirm("Are you sure you want to reject this complaint?")) {
      return;
    }
    rejectComplaint({ complaint });
  };

  const closeAdminModal = () => {
    setShowAdminModal(false);
    setSelectedComplaint(null);
  };

  // Rejection -----------------------------------------------------
  const rejectComplaint = async ({ complaint }) => {
    await intermediateRejectComplaint({
      complaint,
      setComplaints,
      setError,
    });
  };

  // Bulk selection handlers -------------------------------------
  const toggleSelectComplaint = (complaintId) => {
    setSelectedComplaints((prev) => {
      if (prev.includes(complaintId)) {
        return prev.filter((id) => id !== complaintId);
      } else {
        return [...prev, complaintId];
      }
    });
  };

  const selectAllComplaints = () => {
    // Only select complaints that are in the "open" status
    const openComplaints = filteredComplaints
      .filter((complaint) => complaint.status === "open")
      .map((complaint) => complaint._id);

    if (selectedComplaints.length === openComplaints.length) {
      // If all are selected, deselect all
      setSelectedComplaints([]);
    } else {
      // Otherwise select all open complaints
      setSelectedComplaints(openComplaints);
    }
  };

  const handleBulkReject = async () => {
    if (selectedComplaints.length === 0) {
      setError("No complaints selected");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to reject ${selectedComplaints.length} selected complaints?`
      )
    ) {
      return;
    }

    try {
      setBulkActionInProgress(true);
      await intermediateBulkRejectComplaints({
        complaintIds: selectedComplaints,
        action: "reject",
        setError
      });

      // Refresh complaints after bulk action
      setReload((prev) => !prev);
      setSelectedComplaints([]);
    } catch (error) {
      setError("Failed to process bulk action. Please try again.");
    } finally {
      setBulkActionInProgress(false);
    }
  };

  const handleBulkAssign = () => {
    if (selectedComplaints.length === 0) {
      setError("No complaints selected");
      return;
    }
    setShowBulkAssignModal(true);
  };

  const closeBulkAssignModal = () => {
    setShowBulkAssignModal(false);
  };

  const isAllSelected = () => {
    const openComplaints = filteredComplaints
      .filter((c) => c.status === "open")
      .map((c) => c._id);
    return (
      openComplaints.length > 0 &&
      openComplaints.every((id) => selectedComplaints.includes(id))
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto my-4 md:my-6 max-sm:px-2">
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
            <button
              onClick={() => setError(null)}
              className="underline text-sm mt-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Bulk Actions Bar */}
        <div className="p-3 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center">
              <button
                onClick={selectAllComplaints}
                className="flex items-center text-sm text-gray-700 hover:text-blue-600 mr-2"
              >
                {isAllSelected() ? (
                  <CheckSquare size={16} className="mr-1 text-blue-500" />
                ) : (
                  <Square size={16} className="mr-1" />
                )}
                <span>Select All</span>
              </button>
              {selectedComplaints.length > 0 && (
                <span className="text-sm text-gray-600">
                  {selectedComplaints.length} selected
                </span>
              )}
            </div>

            {selectedComplaints.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={handleBulkAssign}
                  disabled={bulkActionInProgress}
                  className="text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-1 px-3 rounded flex items-center gap-1"
                >
                  <UserCheck size={14} />
                  Bulk Assign
                </button>
                <button
                  onClick={handleBulkReject}
                  disabled={bulkActionInProgress}
                  className="text-xs bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-1 px-3 rounded flex items-center gap-1"
                >
                  <X size={14} />
                  Bulk Reject
                </button>
                {bulkActionInProgress && (
                  <span className="flex items-center text-sm text-gray-600">
                    <RefreshCw size={14} className="animate-spin mr-1" />
                    Processing...
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Complaints List */}
        <div>
          {/* Mobile View */}
          <div className="sm:hidden">
            {filteredComplaints.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No complaints match your filter criteria
              </div>
            ) : (
              Array.isArray(filteredComplaints) &&
              filteredComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="border-b border-blue-100 p-3 hover:bg-blue-50"
                >
                  <div className="flex justify-between items-center mb-2">
                    {complaint.status === "open" && (
                      <div
                        onClick={() => toggleSelectComplaint(complaint._id)}
                        className="mr-2 cursor-pointer"
                      >
                        {selectedComplaints.includes(complaint._id) ? (
                          <CheckSquare size={18} className="text-blue-500" />
                        ) : (
                          <Square size={18} className="text-gray-400" />
                        )}
                      </div>
                    )}
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
            <div className="hidden md:grid md:grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr] border-t border-b border-blue-300 bg-white text-sm">
              <div className="font-medium p-2 pl-4 flex items-center">
                <button
                  onClick={selectAllComplaints}
                  className="mr-2 focus:outline-none"
                >
                  {isAllSelected() ? (
                    <CheckSquare size={16} className="text-blue-500" />
                  ) : (
                    <Square size={16} />
                  )}
                </button>
              </div>
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
            ) : (
              Array.isArray(filteredComplaints) &&
              filteredComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-blue-300 text-sm hover:bg-blue-50"
                >
                  <div className="p-2 pl-4 flex items-center">
                    {complaint.status === "open" ? (
                      <button
                        onClick={() => toggleSelectComplaint(complaint._id)}
                        className="focus:outline-none"
                      >
                        {selectedComplaints.includes(complaint._id) ? (
                          <CheckSquare size={16} className="text-blue-500" />
                        ) : (
                          <Square size={16} />
                        )}
                      </button>
                    ) : (
                      <span className="text-gray-300">―</span>
                    )}
                  </div>
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

      {/* Admin Modal Component for single complaint */}
      <AdminModal
        showModal={showAdminModal}
        closeModal={closeAdminModal}
        selectedComplaint={selectedComplaint}
        setComplaints={setComplaints}
        setReload={setReload}
        logout={logout}
        reload={reload}
      />

      {/* Bulk Admin Modal Component */}
      {showBulkAssignModal && (
        <BulkAdminModal
          showModal={showBulkAssignModal}
          closeModal={closeBulkAssignModal}
          selectedComplaintIds={selectedComplaints}
          setReload={setReload}
          reload={reload}
          setBulkActionInProgress={setBulkActionInProgress}
          logout={logout}
        />
      )}
    </div>
  );
}
