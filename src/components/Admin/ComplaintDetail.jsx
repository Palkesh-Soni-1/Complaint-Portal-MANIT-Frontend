import getStatusBadge from "../getStatusBadge";
import { formatDate } from "../../utils";
function ComplaintDetail({ complaint, onBackToList, onStatusUpdate }) {

  return (
    <div>
      <button
        onClick={onBackToList}
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
            <div className="bg-gray-50 px-3 py-4 sm:px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 ">
              <dt className="text-xs sm:text-sm font-medium text-gray-500">
                Student Name
              </dt>
              <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {complaint.studentName}
              </dd>
            </div>
            <div className="bg-white px-3 py-4 sm:px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 ">
              <dt className="text-xs sm:text-sm font-medium text-gray-500">
                Student ID
              </dt>
              <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {complaint.studentId}
              </dd>
            </div>
            <div className="bg-gray-50 px-3 py-4 sm:px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 ">
              <dt className="text-xs sm:text-sm font-medium text-gray-500">
                Hostel & Room
              </dt>
              <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Hostel {complaint.hostelNumber}, Room {complaint.roomNumber}
              </dd>
            </div>
            <div className="bg-white px-3 py-4 sm:px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 ">
              <dt className="text-xs sm:text-sm font-medium text-gray-500">
                Complaint Type
              </dt>
              <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {complaint.complaintType}
              </dd>
            </div>
            <div className="bg-gray-50 px-3 py-4 sm:px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 ">
              <dt className="text-xs sm:text-sm font-medium text-gray-500">
                Complaint Subtype
              </dt>
              <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {complaint.complaintSubType}
              </dd>
            </div>
            <div className="bg-white px-3 py-4 sm:px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 ">
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

            {/* {complaint.attachments && complaint.attachments.length > 0 && (
              <div className="bg-gray-50 px-3 py-4 sm:px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 ">
                <dt className="text-xs sm:text-sm font-medium text-gray-500">
                  Attachments
                </dt>
                <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                    {complaint.attachments.map((attachment, index) => (
                      <li
                        key={index}
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
            <div className="bg-white px-3 py-4 sm:px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 ">
              <dt className="text-xs sm:text-sm font-medium text-gray-500">
                Created At
              </dt>
              <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(complaint.createdAt).toLocaleString()}
              </dd>
            </div>
            <div className="bg-gray-50 px-3 py-4 sm:px-4 sm:py-5">
              <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-3 sm:mb-4">
                Admin Actions
              </h4>
              <div className="flex flex-wrap gap-2 sm:gap-0 sm:flex-nowrap sm:space-x-3">
                {complaint.status === "open" && (
                  <button
                    onClick={() => onStatusUpdate(complaint._id, "processing")}
                    className="text-xs sm:text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 sm:py-2 sm:px-4 rounded"
                  >
                    Mark as Processing
                  </button>
                )}
                {complaint.status !== "resolved" && (
                  <button
                    onClick={() => onStatusUpdate(complaint._id, "resolved")}
                    className="text-xs sm:text-sm bg-green-500 hover:bg-green-600 text-white py-1 px-3 sm:py-2 sm:px-4 rounded"
                  >
                    Mark as Resolved
                  </button>
                )}
                {complaint.status === "resolved" && (
                  <button
                    onClick={() => onStatusUpdate(complaint._id, "open")}
                    className="text-xs sm:text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 sm:py-2 sm:px-4 rounded"
                  >
                    Reopen Complaint
                  </button>
                )}
              </div>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

export default ComplaintDetail;
