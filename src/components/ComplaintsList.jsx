// src/components/ComplaintsList.jsx
import { useEffect, useState } from 'react';

function ComplaintsList({ complaints, onSelectComplaint, onStatusUpdate }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Available complaint types
  const complaintTypes = [
    "Academic",
    "Hostel",
    "Scholarship",
    "Medical",
    "Department",
    "Sports",
    "Ragging"
  ];
  
  // Filter complaints based on current filters and search term
  const filteredComplaints = complaints.filter(complaint => {
    const matchesStatusFilter = filter === 'all' || complaint.status === filter;
    const matchesTypeFilter = typeFilter === 'all' || complaint.complaintType === typeFilter;
    const matchesSearch = 
      complaint.complaintNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.studentId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatusFilter && matchesTypeFilter && matchesSearch;
  });

  return (
    <div>
      <h2 className="text-2xl text-center font-bold text-gray-100 mb-6">All Complaints</h2>
      
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Status
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-4 py-2 rounded-md ${
              filter === 'open' 
                ? 'bg-red-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Open
          </button>
          <button
            onClick={() => setFilter('processing')}
            className={`px-4 py-2 rounded-md ${
              filter === 'processing' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Processing
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-4 py-2 rounded-md ${
              filter === 'resolved' 
                ? 'bg-green-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Resolved
          </button>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">All Types</option>
              {complaintTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search complaints..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Complaints Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Complaint No.
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student Details
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hostel/Room
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Reported
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredComplaints.map(complaint => (
              <tr key={complaint._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {complaint.complaintNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <button 
                      onClick={() => onSelectComplaint(complaint._id)}
                      className="text-indigo-600 hover:text-indigo-900 hover:underline font-medium"
                    >
                      {complaint.studentName}
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">{complaint.studentId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {complaint.hostelNumber} - {complaint.roomNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex flex-col space-y-1">
                    <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                      {complaint.complaintSubType}
                    </span>
                    <span className="text-xs text-gray-500">{complaint.complaintType}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {complaint.dateReported}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${complaint.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                      complaint.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    {/* Show Process button only for 'open' complaints */}
                    {complaint.status === 'open' && (
                      <button
                        onClick={() => onStatusUpdate(complaint._id, 'processing')}
                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
                      >
                        Process
                      </button>
                    )}
                    
                    {/* Show Resolve button for 'open' and 'processing' complaints, but not 'resolved' */}
                    {complaint.status !== 'resolved' && (
                      <button
                        onClick={() => onStatusUpdate(complaint._id, 'resolved')}
                        className="text-xs bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded"
                      >
                        Resolve
                      </button>
                    )}
                    
                    {/* Always show View button */}
                    <button
                      onClick={() => onSelectComplaint(complaint._id)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded"
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredComplaints.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No complaints found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}

export default ComplaintsList;