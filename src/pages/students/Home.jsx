// App.jsx
import React, { useState } from "react";
import { Download, Search, Check, Clock, AlertCircle } from "lucide-react";

function Home() {
  const [dateRange, setDateRange] = useState({
    start: "Jan 12",
    end: "Mar 11",
  });
  const [showSolved, setShowSolved] = useState(true);

  const complaints = [
    { id: "123456", date: "11 April 2025", type: "Academic", status: "Solved" },
    {
      id: "123456",
      date: "11 April 2025",
      type: "Academic",
      status: "Open",
      isEscalated: true,
    },
    {
      id: "123456",
      date: "11 April 2025",
      type: "Academic",
      status: "Process",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto my-10 p-4 font-sans min-h-screen bg-blue-300 rounded-xl">
      <div className=" overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r rounded-lg from-blue-500 to-blue-600 p-4 border-b border-blue-300 flex justify-between items-center ">
          <h1 className="text-lg font-bold text-blue-900">
            Complaints ( 258 )
          </h1>
          <div className="flex items-center gap-2">
            <button className="text-gray-200 text-sm hover:underline">
              View list of Complaints Below
            </button>
          </div>
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
            />
          </div>
          <button className="flex items-center gap-2 text-sm bg-white border border-gray-300 rounded-md px-3 py-1">
            <Download size={18} />
            Download as CSV
          </button>
        </div>

        <div className="bg-white rounded-lg overflow-hidden">
          {/* Filters */}
          <div className="px-4 py-2 flex justify-between items-center">
            <h2 className="text-sm font-medium">Filter Your Search</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm">
                  {dateRange.start} - {dateRange.end}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm">Solved</span>
              </div>
            </div>
          </div>

          {/* Table Headers */}
          <div className="grid grid-cols-4 border-t border-b border-blue-300 bg-white text-sm">
            <div className="font-medium p-4">Complaint No.</div>
            <div className="font-medium p-4">Date of Complaint</div>
            <div className="font-medium p-4">Type of Complaint</div>
            <div className="font-medium p-4">Status</div>
          </div>

          {/* Table Rows */}
          {complaints.map((complaint, index) => (
            <div
              key={index}
              className="grid grid-cols-4 border-b border-blue-300 text-sm hover:bg-blue-50"
            >
              <div className="p-4 text-blue-600">{complaint.id}</div>
              <div className="p-4 text-gray-600">{complaint.date}</div>
              <div className="p-4 text-blue-800 font-medium">
                {complaint.type}
              </div>
              <div className="p-4">
                {complaint.status === "Solved" && (
                  <div className="bg-green-200 text-green-800 px-6 py-1 rounded-full w-min whitespace-nowrap flex items-center justify-center">
                    Solved
                  </div>
                )}
                {complaint.status === "Open" && (
                  <div className="bg-red-500 text-white px-6 py-1 rounded-full w-min whitespace-nowrap flex items-center justify-center">
                    Open
                    {/* {complaint.isEscalated && <span className="ml-1">ICU</span>} */}
                  </div>
                )}
                {complaint.status === "Process" && (
                  <div className="bg-yellow-300 text-yellow-800 px-6 py-1 rounded-full w-min whitespace-nowrap flex items-center justify-center">
                    Process
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
