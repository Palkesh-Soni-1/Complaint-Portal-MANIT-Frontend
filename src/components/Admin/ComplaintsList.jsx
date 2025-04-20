import { useState } from "react";
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

function ComplaintsList({ complaints, onSelectComplaint, onStatusUpdate }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  const complaintTypes = [
    "Academic",
    "Hostel",
    "Scholarship",
    "Medical",
    "Department",
    "Sports",
    "Ragging",
  ];

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesStatusFilter =
      statusFilter === "all" || complaint.status === statusFilter;
    const matchesTypeFilter =
      typeFilter === "all" || complaint.complaintType === typeFilter;
    const matchesSearch =
      complaint.complaintNumber
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      complaint.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.studentId?.toLowerCase().includes(searchTerm.toLowerCase());

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
  });

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

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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

  const handleDateFilterChange = (field, value) => {
    setDateFilter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="max-w-[1100px] mx-auto my-4 md:my-6">
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

        <div>
          {/* Mobile View (from first code) */}
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
                    <div className="text-blue-600 font-medium">
                      {complaint.complaintNumber}
                    </div>
                    <div>{getStatusBadge(complaint.status)}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-600">Student:</div>
                    <div>
                      <button
                        onClick={() => onSelectComplaint(complaint._id)}
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
                      onClick={() => onSelectComplaint(complaint._id)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop View (implementing the table from second code but with first code's structure) */}
          <div className="hidden sm:block">
            <div className="hidden md:grid md:grid-cols-5 border-t border-b border-blue-300 bg-white text-sm">
              <div className="font-medium p-3 md:p-4">Complaint No.</div>
              <div className="font-medium p-3 md:p-4">Student Details</div>
              <div className="font-medium p-3 md:p-4">Type</div>
              <div className="font-medium p-3 md:p-4">Date</div>
              <div className="font-medium p-3 md:p-4">Status</div>
            </div>

            {filteredComplaints.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No complaints match your filter criteria
              </div>
            ) : (
              filteredComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="grid grid-cols-5 border-b border-blue-300 text-sm hover:bg-blue-50"
                >
                  <div className="p-3 md:p-4 text-blue-600">
                    {complaint.complaintNumber}
                  </div>
                  <div className="p-3 md:p-4">
                    <div>
                      <button
                        onClick={() => onSelectComplaint(complaint._id)}
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
                  <div className="p-3 md:p-4 flex flex-col gap-2 relative">
                    <div>{getStatusBadge(complaint.status)}</div>
                    <div className="flex space-x-2">
                      <div className="relative group">
                        <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded">
                          Update
                        </button>
                        <div className="absolute left-0 w-40 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
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
                        onClick={() => onSelectComplaint(complaint._id)}
                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
                      >
                        View
                      </button>
                    </div>
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
