// src/components/ComplaintDetail.jsx
function ComplaintDetail({ complaint, onBackToList, onStatusUpdate }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div>
      <button
        onClick={onBackToList}
        className="flex items-center text-indigo-600 hover:text-indigo-900 mb-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to List
      </button>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="flex justify-between items-center px-4 py-5 sm:px-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Complaint {complaint.complaintNumber}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Reported on {formatDate(complaint.dateReported)}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
              {complaint.complaintSubType}
            </span>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full 
              ${complaint.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                complaint.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'}`}>
              {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Student Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{complaint.studentName}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Student ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{complaint.studentId}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Hostel & Room</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Hostel {complaint.hostelNumber}, Room {complaint.roomNumber}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Complaint Type</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{complaint.complaintType}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Complaint Subtype</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{complaint.complaintSubType}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {complaint.description}
              </dd>
            </div>
            {complaint.attachments && complaint.attachments.length > 0 && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Attachments</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                    {complaint.attachments.map((attachment, index) => (
                      <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                          </svg>
                          <span className="ml-2 flex-1 w-0 truncate">{attachment}</span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <button className="font-medium text-indigo-600 hover:text-indigo-500">
                            View
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(complaint.createdAt).toLocaleString()}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:px-6">
              <h4 className="text-sm font-medium text-gray-500 mb-4">Admin Actions</h4>
              <div className="flex space-x-3">
                {complaint.status === 'open' && (
                  <button
                    onClick={() => onStatusUpdate(complaint._id, 'processing')}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  >
                    Mark as Processing
                  </button>
                )}
                {complaint.status !== 'resolved' && (
                  <button
                    onClick={() => onStatusUpdate(complaint._id, 'resolved')}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                  >
                    Mark as Resolved
                  </button>
                )}
                {complaint.status === 'resolved' && (
                  <button
                    onClick={() => onStatusUpdate(complaint._id, 'open')}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
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