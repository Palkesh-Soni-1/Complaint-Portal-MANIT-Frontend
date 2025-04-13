// App.jsx
import React, { useState, useEffect } from "react";
import {
  Download,
  Search,
  Check,
  Clock,
  AlertCircle,
  Calendar,
  Filter,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Home() {
  const { auth } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchComplaintsById = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SITE}/complaint/get?studentId=${
            auth?.userData?.studentId
          }`
        );
        if (res.ok) {
          const data = (await res.json()).data;
          setComplaints(data);
          setFilteredComplaints(data);
        }
      } catch (err) {
        console.log("Failed To Fetch Complaints");
      } finally {
        setLoading(false);
      }
    };

    if (auth) {
      fetchComplaintsById();
    }
  }, [auth]);

  // Apply filters whenever filter states change
  useEffect(() => {
    applyFilters();
  }, [statusFilter, dateFilter, searchTerm, complaints]);

  const applyFilters = () => {
    let result = [...complaints];

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((complaint) => complaint.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter.startDate && dateFilter.endDate) {
      const startDate = new Date(dateFilter.startDate);
      const endDate = new Date(dateFilter.endDate);

      result = result.filter((complaint) => {
        const complaintDate = new Date(complaint.createdAt);
        return complaintDate >= startDate && complaintDate <= endDate;
      });
    }

    // Apply search term
    if (searchTerm) {
      result = result.filter(
        (complaint) =>
          complaint.complaintNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          complaint.complaintType
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          complaint.dateReported
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredComplaints(result);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleDateFilterChange = (field, value) => {
    setDateFilter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setDateFilter({
      startDate: "",
      endDate: "",
    });
    setSearchTerm("");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "resolved":
        return (
          <div className="bg-green-200 text-green-800 px-6 py-1 rounded-full w-min whitespace-nowrap flex items-center gap-1">
            <Check size={14} />
            Resolved
          </div>
        );
      case "open":
        return (
          <div className="bg-red-500 text-white px-6 py-1 rounded-full w-min whitespace-nowrap flex items-center gap-1">
            <AlertCircle size={14} />
            Open
          </div>
        );
      case "processing":
        return (
          <div className="bg-yellow-300 text-yellow-800 px-6 py-1 rounded-full w-min whitespace-nowrap flex items-center gap-1">
            <Clock size={14} />
            Processing
          </div>
        );
      default:
        return (
          <div className="bg-gray-200 text-gray-800 px-6 py-1 rounded-full w-min whitespace-nowrap">
            {status}
          </div>
        );
    }
  };

  const downloadAsCSV = () => {
    // Create CSV content
    const headers = ["Complaint No.", "Date", "Type", "Status"];
    const csvContent = [
      headers.join(","),
      ...filteredComplaints.map((complaint) =>
        [
          complaint.complaintNumber,
          complaint.dateReported,
          complaint.complaintType,
          complaint.status,
        ].join(",")
      ),
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `complaints_${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto my-10 p-4 font-sans min-h-screen bg-blue-300 rounded-xl">
      <div className="overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r rounded-lg from-blue-500 to-blue-600 p-4 border-b border-blue-300 flex justify-between items-center">
          <h1 className="text-lg font-bold text-blue-100">
            Complaints ({filteredComplaints.length})
          </h1>
        </div>

        {/* Search bar */}
        <div className="py-4 flex justify-between bg-transparent">
          <div className="relative w-2/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search Here"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <button
            className="flex items-center gap-2 text-sm bg-white border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-50"
            onClick={downloadAsCSV}
          >
            <Download size={18} />
            <p className="max-sm:hidden">Download as CSV</p>
          </button>
        </div>

        <div className="bg-white rounded-lg overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b border-blue-100">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <h2 className="text-sm font-medium flex items-center gap-2">
                <Filter size={16} className="text-blue-500" />
                Filter Your Search
              </h2>

              <div className="flex flex-wrap gap-4 items-center">
                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <label htmlFor="status" className="text-sm text-gray-600">
                    Status:
                  </label>
                  <select
                    id="status"
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="processing">Processing</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                {/* Date Range Filter */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar size={14} />
                    From:
                  </label>
                  <input
                    type="date"
                    value={dateFilter.startDate}
                    onChange={(e) =>
                      handleDateFilterChange("startDate", e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">To:</label>
                  <input
                    type="date"
                    value={dateFilter.endDate}
                    onChange={(e) =>
                      handleDateFilterChange("endDate", e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                  />
                </div>

                {/* Clear Filters Button */}
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(statusFilter !== "all" ||
              dateFilter.startDate ||
              dateFilter.endDate) && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs text-gray-500">Active filters:</span>

                {statusFilter !== "all" && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Status: {statusFilter}
                  </span>
                )}

                {dateFilter.startDate && dateFilter.endDate && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Date: {new Date(dateFilter.startDate).toLocaleDateString()}{" "}
                    - {new Date(dateFilter.endDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Table Headers */}
          <div className="grid grid-cols-4 border-t border-b border-blue-300 bg-white text-sm">
            <div className="font-medium p-4">Complaint No.</div>
            <div className="font-medium p-4">Date of Complaint</div>
            <div className="font-medium p-4">Type of Complaint</div>
            <div className="font-medium p-4">Status</div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading complaints...
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No complaints match your filter criteria
            </div>
          ) : (
            /* Table Rows */
            filteredComplaints.map((complaint, index) => (
              <div
                key={index}
                className="grid grid-cols-4 border-b border-blue-300 text-sm hover:bg-blue-50"
              >
                <div className="p-4 text-blue-600">
                  {complaint.complaintNumber}
                </div>
                <div className="p-4 text-gray-600">
                  {complaint.dateReported}
                </div>
                <div className="p-4 text-blue-800 font-medium">
                  {complaint.complaintType}
                </div>
                <div className="p-4">{getStatusBadge(complaint.status)}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
