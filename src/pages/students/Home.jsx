import React, { useState, useEffect } from "react";
import {
  Download,
  Search,
  Calendar,
  Filter,
  ChevronRight,
} from "lucide-react";
import Loader from "../../components/Loader";
import { NavLink } from "react-router-dom";

import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";

import { fetchComplaintsByStudentId } from "../../services/api/complaint";
import getStatusBadge from "../../components/getStatusBadge";
import downloadAsCSV from "../../services/repository/downloadAsCsv";

function Home() {
  const { auth } = useAuth();
  const { info } = useData();
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (auth.isAuthenticated && info?.studentId) {
      fetchComplaintsByStudentId({
        setLoading,
        setComplaints,
        studentId: info?.studentId,
        setFilteredComplaints,
      });
    }
  }, [auth, info]);

  useEffect(() => {
    applyFilters();
  }, [statusFilter, dateFilter, searchTerm, complaints]);

  const applyFilters = () => {
    let result = [...complaints];

    if (statusFilter !== "all") {
      result = result.filter((complaint) => complaint.status === statusFilter);
    }

    if (dateFilter.startDate && dateFilter.endDate) {
      const startDate = new Date(dateFilter.startDate);
      const endDate = new Date(dateFilter.endDate);

      result = result.filter((complaint) => {
        const complaintDate = new Date(complaint.createdAt);
        return complaintDate >= startDate && complaintDate <= endDate;
      });
    }

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

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="max-w-[1200px] mx-auto my-4 md:my-10 px-2 font-sans min-h-screen rounded-lg md:rounded-xl">
      <div className="overflow-hidden">
        <div className="bg-gradient-to-r rounded-lg from-blue-500 to-blue-600 p-3 md:p-4 border-b border-blue-300 flex justify-between items-center">
          <h1 className="text-base md:text-lg font-bold text-blue-100">
            Complaints ({filteredComplaints.length})
          </h1>
        </div>

        <div className="py-3 md:py-4 flex max-lg:flex-col flex-row max-lg:gap-2 gap-0 sm:justify-between bg-transparent">
          <div className="relative w-full lg:w-2/3">
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
            <button
              className="flex items-center justify-center gap-2 text-sm bg-white border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50"
              onClick={()=>downloadAsCSV({filteredComplaints})}
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <div
            className={`border-b border-blue-100 transition-all duration-300 overflow-hidden ${
              isFilterOpen ? "max-h-96" : "max-h-0"
            }`}
          >
            <div className="p-4">
              <div className="flex flex-col gap-4">
                <h2 className="text-sm font-medium flex items-center gap-2">
                  <Filter size={16} className="text-blue-500" />
                  Filter Your Search
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="status" className="text-sm text-gray-600">
                      Status:
                    </label>
                    <select
                      id="status"
                      value={statusFilter}
                      onChange={handleStatusFilterChange}
                      className="border border-gray-300 rounded-md px-2 py-2 text-sm"
                    >
                      <option value="all">All</option>
                      <option value="open">Open</option>
                      <option value="assigned">Assigned</option>
                      <option value="processing">Processing</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
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
                  className="text-sm text-blue-600 hover:text-blue-800 underline self-start"
                >
                  Clear Filters
                </button>
              </div>

              {(statusFilter !== "all" ||
                dateFilter.startDate ||
                dateFilter.endDate) && (
                <div className="mt-3 flex items-center flex-wrap gap-2">
                  <span className="text-xs text-gray-500">Active filters:</span>

                  {statusFilter !== "all" && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Status: {statusFilter}
                    </span>
                  )}

                  {dateFilter.startDate && dateFilter.endDate && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Date:{" "}
                      {new Date(dateFilter.startDate).toLocaleDateString()} -{" "}
                      {new Date(dateFilter.endDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="hidden md:grid md:grid-cols-4 border-t border-b border-blue-300 bg-white text-sm">
              <div className="font-medium p-3 md:p-4">Complaint No.</div>
              <div className="font-medium p-3 md:p-4">Date</div>
              <div className="font-medium p-3 md:p-4">Type</div>
              <div className="font-medium p-3 md:p-4">Status</div>
            </div>

            {loading ? (
              <div className="text-center py-8 text-gray-500">
                <Loader />
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No complaints match your filter criteria
              </div>
            ) : (
              <div>
                <div className="sm:hidden">
                  {filteredComplaints.map((complaint, index) => (
                    <NavLink
                      key={complaint._id}
                      to={`/student/complaints/${complaint._id}`}
                      state={{ complaint }}
                      className="border-b border-blue-100 p-3 hover:bg-blue-50"
                    >
                      <div className="flex justify-between items-center mb-2 px-2">
                        <div className="text-blue-600 font-medium">
                          {complaint.complaintNumber}
                        </div>
                        <div>{getStatusBadge(complaint.status)}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 px-2">
                        <div className="text-gray-600">Date:</div>
                        <div>{complaint.dateReported}</div>
                        <div className="text-gray-600">Type:</div>
                        <div className="text-blue-800 font-medium">
                          {complaint.complaintType}
                        </div>
                      </div>
                    </NavLink>
                  ))}
                </div>

                <div className="hidden sm:block">
                  {filteredComplaints.map((complaint, index) => (
                    <NavLink
                      key={complaint._id}
                      to={`/student/complaints/${complaint._id}`}
                      state={{ complaint }}
                      className="grid grid-cols-4 border-b border-blue-300 text-sm hover:bg-blue-50"
                    >
                      <div className="p-3 sm:p-4 text-blue-600">
                        {complaint.complaintNumber}
                      </div>
                      <div className="p-3 sm:p-4 text-gray-600">
                        {complaint.dateReported}
                      </div>
                      <div className="p-3 sm:p-4 text-blue-800 font-medium">
                        {complaint.complaintType}
                      </div>
                      <div className="p-3 sm:p-4">
                        {getStatusBadge(complaint.status)}
                      </div>
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
