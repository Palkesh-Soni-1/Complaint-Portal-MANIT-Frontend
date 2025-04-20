import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

import {
  Check,
  Clock,
  AlertCircle,
  UserCheck,
  X,
} from "lucide-react";

import { fetchComplaintByComplaintNumber } from "../../services/api/complaint";

function ComplaintViewPage() {
  const { complaintNumber } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const { info } = useData();

  // Getting complaint from location state
  const [complaint, setComplaint] = useState(location.state?.complaint || null);

  const [loading, setLoading] = useState(!complaint);

  useEffect(() => {
    if (!complaint && auth.isAuthenticated && info?.studentId) {
      fetchComplaintByComplaintNumber({
        setLoading,
        complaintNumber,
        studentId: info?.studentId,
        setComplaint,
      });
    }
  }, [complaint, auth, info, complaintNumber]);

  // Loader
  if (loading)
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <Loader />
      </div>
    );

  // date formatting
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // User (SIMON) GO-BACK
  const handleBackToList = () => {
    navigate(-1);
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

  if (!complaint) {
    return (
      <div className="text-center text-red-600 text-sm sm:text-base mt-6">
        No complaint data found. Please go back and try again.
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto min-h-[70vh] py-5 px-2">
      <button
        onClick={handleBackToList}
        className="flex items-center text-gray-100 hover:text-gray-300 mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 sm:h-5 sm:w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm sm:text-base">Back to List</span>
      </button>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg rounded-sm">
        <div className="flex justify-between items-center px-3 py-4 sm:px-4 sm:py-5 border-b border-gray-200">
          <div>
            <h3 className="text-base flex gap-1 max-sm:flex-col sm:text-lg leading-6 font-medium text-gray-900">
              <span>Complaint </span>
              <span className="text-blue-900">{complaint.complaintNumber}</span>
            </h3>
            <p className="mt-1 max-w-2xl text-xs sm:text-sm text-gray-500">
              Reported on {formatDate(complaint.dateReported)}
            </p>
          </div>
          <div className="flex max-sm:flex-col gap-2 items-center space-x-2 sm:space-x-3">
            <span className="px-2 py-1 sm:px-3 sm:py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
              {complaint.complaintSubType}
            </span>
            {getStatusBadge(complaint.status)}
          </div>
        </div>

        <div className="border-t border-gray-200">
          <dl>
            {/* Student Name */}
            <div className="bg-gray-50 px-3 py-4 sm:px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-xs sm:text-sm font-medium text-gray-500">
                Student Name
              </dt>
              <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {complaint.studentName}
              </dd>
            </div>

            {/* Student ID */}
            <div className="bg-white px-3 py-4 sm:px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-xs sm:text-sm font-medium text-gray-500">
                Student ID
              </dt>
              <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {complaint.studentId}
              </dd>
            </div>

            {/* Hostel & Room */}
            <div className="bg-gray-50 px-3 py-4 sm:px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-xs sm:text-sm font-medium text-gray-500">
                Hostel & Room
              </dt>
              <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Hostel {complaint.hostelNumber}, Room {complaint.roomNumber}
              </dd>
            </div>

            {/* Complaint Type */}
            <div className="bg-white px-3 py-4 sm:px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-xs sm:text-sm font-medium text-gray-500">
                Complaint Type
              </dt>
              <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {complaint.complaintType}
              </dd>
            </div>

            {/* Complaint Subtype */}
            <div className="bg-gray-50 px-3 py-4 sm:px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-xs sm:text-sm font-medium text-gray-500">
                Complaint Subtype
              </dt>
              <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {complaint.complaintSubType}
              </dd>
            </div>

            {/* Description */}
            <div className="bg-white px-3 py-4 sm:px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-xs sm:text-sm font-medium text-gray-500">
                Description
              </dt>
              <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {complaint.description}
              </dd>
            </div>

            {complaint.status !== "open" ? (
              <div>
                {complaint.processed && (
                  <div className="bg-gray-50 px-3 py-4 sm:px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 ">
                    <dt className="text-xs sm:text-sm font-medium text-gray-500">
                      Processing Feedback
                    </dt>
                    <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {complaint.processingFeedback}
                    </dd>
                  </div>
                )}
                {complaint.resolved && (
                  <div className="bg-white px-3 py-4 sm:px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 ">
                    <dt className="text-xs sm:text-sm font-medium text-gray-500">
                      Resolving Feedback
                    </dt>
                    <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {complaint.resolvingFeedback}
                    </dd>
                  </div>
                )}
              </div>
            ) : null}

            {/* Attachments */}
            {/* {complaint.attachments && complaint.attachments.length > 0 && (
              <div className="bg-gray-50 px-3 py-4 sm:px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-xs sm:text-sm font-medium text-gray-500">
                  Attachments
                </dt>
                <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                    {complaint.attachments.map((attachment, idx) => (
                      <li
                        key={idx}
                        className="pl-2 pr-3 py-2 sm:pl-3 sm:pr-4 sm:py-3 flex items-center justify-between text-xs sm:text-sm"
                      >
                        <div className="w-0 flex-1 flex items-center">
                          <svg
                            className="flex-shrink-0 h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="ml-2 flex-1 w-0 truncate">
                            {attachment}
                          </span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <button className="font-medium text-xs sm:text-sm text-indigo-600 hover:text-indigo-500">
                            View
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )} */}

            {/* Created At */}
            <div className="bg-white px-3 py-4 sm:px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-xs sm:text-sm font-medium text-gray-500">
                Created At
              </dt>
              <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(complaint.createdAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

export default ComplaintViewPage;
