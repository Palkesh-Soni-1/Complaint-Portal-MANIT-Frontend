import { useState,useEffect } from "react";
import {
  Search,
  Filter,
  ChevronRight,
  CheckSquare,
  Square
} from "lucide-react";
import getStatusBadge from "../getStatusBadge";
import { formatDate } from "../../utils";
import { filterComplaintList } from "../../services/filters/adminFilters";

function ComplaintsList({
  complaints,
  onSelectComplaintForView,
  onStatusUpdate,
  onBulkStatusUpdate,
}) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  // Selection state ----------------------------------------
  const [selectedComplaints, setSelectedComplaints] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [highestValidStatusType, setHighestValidStatusType] =
    useState("assigned");

  const statusOrder = {
    assigned: 1,
    processing: 2,
    resolved: 3,
    reopen: 4,
  };

  // Type of Complaints -------------------------------------
  const complaintTypes = [
    "Academic",
    "Hostel",
    "Scholarship",
    "Medical",
    "Department",
    "Sports",
    "Ragging",
  ];

  // Filteration ---------------------------------------------
  const filteredComplaints = filterComplaintList({
    statusFilter,
    complaints,
    typeFilter,
    dateFilter,
    searchTerm
  });

  useEffect(() => {
    if (selectedComplaints.length === 0) {
      setHighestValidStatusType("assigned");
      return;
    }

    // Find the selected complaint objects
    const selectedComplaintObjects = complaints.filter((complaint) =>
      selectedComplaints.includes(complaint._id)
    );

    // Determine the highest status in the selection
    let highestStatus = "assigned"; // Start with lowest status
    let highestOrder = statusOrder["assigned"]; // Start with lowest order value

    selectedComplaintObjects.forEach((complaint) => {
      const currentStatus = complaint.status;
      const currentOrder = statusOrder[currentStatus] || -1; // Default low if status not found

      if (currentOrder > highestOrder) {
        highestOrder = currentOrder;
        highestStatus = currentStatus;
      }
    });

    setHighestValidStatusType(highestStatus);
  }, [selectedComplaints, complaints]);

  // Selection of Complaint Rows -------------------------------

  // Toggle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedComplaints([]);
    } else {
      setSelectedComplaints(
        filteredComplaints.map((complaint) => complaint._id)
      );
    }
    setSelectAll(!selectAll);
  };

  // Toggle individual complaint selection
  const handleSelectComplaint = (id) => {
    if (selectedComplaints.includes(id)) {
      setSelectedComplaints((prev) =>
        prev.filter((complaintId) => complaintId !== id)
      );
      setSelectAll(false);
    } else {
      setSelectedComplaints((prev) => [...prev, id]);
      // Check if all filtered complaints are now selected
      if (selectedComplaints.length + 1 === filteredComplaints.length) {
        setSelectAll(true);
      }
    }
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = (statusType) => {
    onBulkStatusUpdate(selectedComplaints, statusType);
    // setSelectedComplaints([]);
    // setSelectAll(false);
  };

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

  // Determine if bulk actions should be enabled
  const bulkActionsEnabled = selectedComplaints.length > 0;

  // Determine which buttons should be enabled based on highest status
  const canMarkProcessing = highestValidStatusType === "assigned";
  const canMarkResolved =
    highestValidStatusType === "assigned" ||
    highestValidStatusType === "processing";
  const canMarkReopen = true;

  return (
    <div className="max-w-[1200px] mx-auto my-4 md:my-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 md:p-4 rounded-t-lg">
        <h2 className="text-lg md:text-xl text-center md:text-left font-bold text-gray-100">
          All Complaints
        </h2>
      </div>

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
                    <option value="assigned">Assigned</option>
                    <option value="processing">Processing</option>
                    <option value="resolved">Resolved</option>
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

        {/* Bulk Action Bar */}
        <div
          className={`bg-blue-50 border-b border-blue-200 p-3 flex items-center justify-between transition-all max-sm:flex-col max-sm:gap-2 duration-300 ${
            bulkActionsEnabled
              ? "opacity-100"
              : "opacity-0 h-0 p-0 overflow-hidden"
          }`}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="flex items-center text-gray-700 hover:text-blue-600"
            >
              {selectAll ? (
                <CheckSquare size={18} className="text-blue-600" />
              ) : (
                <Square size={18} />
              )}
              <span className="ml-2 text-sm font-medium">
                {selectAll ? "Deselect All" : "Select All"}
              </span>
            </button>
            <span className="text-sm text-gray-600 ml-4 mr-2 text-center">
              {selectedComplaints.length} selected
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkStatusUpdate("processing")}
              disabled={!bulkActionsEnabled || !canMarkProcessing}
              className="text-xs bg-yellow-400 hover:bg-yellow-500 text-yellow-800 py-1 px-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mark Processing
            </button>
            <button
              onClick={() => handleBulkStatusUpdate("resolved")}
              disabled={!bulkActionsEnabled || !canMarkResolved}
              className="text-xs bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mark Resolved
            </button>
            <button
              onClick={() => handleBulkStatusUpdate("open")}
              disabled={!bulkActionsEnabled || !canMarkReopen}
              className="text-xs bg-orange-500 hover:bg-orange-600 text-white py-1 px-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mark Open
            </button>
          </div>
        </div>

        <div>
          {/* Mobile View */}
          <div className="sm:hidden">
            {filteredComplaints.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No complaints match your filter criteria
              </div>
            ) : (
              filteredComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="border-b border-blue-100 p-3 hover:bg-blue-50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleSelectComplaint(complaint._id)}
                        className="mr-2 flex-shrink-0"
                      >
                        {selectedComplaints.includes(complaint._id) ? (
                          <CheckSquare size={18} className="text-blue-600" />
                        ) : (
                          <Square size={18} />
                        )}
                      </button>
                      <div className="text-blue-600 font-medium">
                        {complaint.complaintNumber}
                      </div>
                    </div>
                    <div>{getStatusBadge(complaint.status)}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-600">Student:</div>
                    <div>
                      <button
                        onClick={() => onSelectComplaintForView(complaint._id)}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        {complaint.studentName}
                      </button>
                    </div>
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
                    {complaint.status === "assigned" && (
                      <button
                        onClick={() =>
                          onStatusUpdate(complaint._id, "processing")
                        }
                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
                      >
                        Process
                      </button>
                    )}

                    {complaint.status !== "resolved" && (
                      <button
                        onClick={() =>
                          onStatusUpdate(complaint._id, "resolved")
                        }
                        className="text-xs bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded"
                      >
                        Resolve
                      </button>
                    )}

                    {complaint.status === "resolved" && (
                      <button
                        onClick={() => onStatusUpdate(complaint._id, "open")}
                        className="text-xs bg-orange-500 hover:bg-orange-600 text-white py-1 px-2 rounded"
                      >
                        Reopen
                      </button>
                    )}

                    <button
                      onClick={() => onSelectComplaintForView(complaint._id)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop View */}
          <div className="hidden sm:block">
            <div className="hidden md:grid md:grid-cols-6 border-t border-b border-blue-300 bg-white text-sm">
              <div className="font-medium p-3 md:p-4 flex items-center">
                <button onClick={handleSelectAll} className="mr-3">
                  {selectAll ? (
                    <CheckSquare size={18} className="text-blue-600" />
                  ) : (
                    <Square size={18} />
                  )}
                </button>
                Complaint No.
              </div>
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
              filteredComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="grid grid-cols-6 border-b border-blue-300 text-sm hover:bg-blue-50"
                >
                  <div className="p-3 md:p-4 text-blue-600 flex items-center">
                    <button
                      onClick={() => handleSelectComplaint(complaint._id)}
                      className="mr-3 flex-shrink-0"
                    >
                      {selectedComplaints.includes(complaint._id) ? (
                        <CheckSquare size={18} className="text-blue-600" />
                      ) : (
                        <Square size={18} />
                      )}
                    </button>
                    {complaint.complaintNumber}
                  </div>
                  <div className="p-3 md:p-4">
                    <div>
                      <button
                        onClick={() => onSelectComplaintForView(complaint._id)}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        {complaint.studentName}
                      </button>
                    </div>
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
                    <div>{getStatusBadge(complaint.status)}</div>
                  </div>
                  <div className="p-3 md:p-4 flex gap-2">
                    <div className="relative group">
                      <button className="text-xs bg-teal-500 hover:bg-teal-600 text-gray-50 py-1 px-2 h-full rounded">
                        Update
                      </button>
                      <div className="absolute right-0 w-40 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                        {complaint.status === "assigned" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusUpdate(complaint._id, "processing");
                            }}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            Mark as Processing
                          </button>
                        )}
                        {complaint.status !== "resolved" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusUpdate(complaint._id, "resolved");
                            }}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            Mark as Resolved
                          </button>
                        )}
                        {complaint.status === "resolved" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusUpdate(complaint._id, "open");
                            }}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            Reopen Complaint
                          </button>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectComplaintForView(complaint._id)}
                      className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
                    >
                      View
                    </button>
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
    </div>
  );
}

export default ComplaintsList;
