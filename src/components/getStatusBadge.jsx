import {
  Check,
  Clock,
  AlertCircle,
  UserCheck,
  X,
} from "lucide-react";

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

export default getStatusBadge;
