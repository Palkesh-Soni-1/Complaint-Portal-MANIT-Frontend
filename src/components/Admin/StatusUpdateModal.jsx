import { useState } from "react";
import { CheckCircle, AlertCircle, RefreshCw, X, Clock } from "lucide-react";

function StatusUpdateModal({
  isOpen,
  onClose,
  onConfirm,
  complaintId,
  statusType,
}) {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedback.trim()) {
      alert("Please provide feedback before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      await onConfirm(complaintId, statusType, feedback);
      setFeedback("");
      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Status-specific content
  const statusConfig = {
    processing: {
      title: "Mark as Processing",
      label: "Processing feedback",
      icon: <Clock size={20} className="text-yellow-500" />,
      color: "yellow",
      description: "The complaint will be marked as being actively worked on.",
    },
    resolved: {
      title: "Mark as Resolved",
      label: "Closing feedback",
      icon: <CheckCircle size={20} className="text-green-500" />,
      color: "green",
      description: "The complaint will be marked as successfully resolved.",
    },
    open: {
      title: "Reopen Complaint",
      label: "Reopening feedback",
      icon: <RefreshCw size={20} className="text-blue-500" />,
      color: "blue",
      description: "The complaint will be reopened as a fresh complaint.",
    },
  };

  const currentStatus = statusConfig[statusType];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 max-sm:p-2 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all animate-fadeIn">
        <div className="flex justify-between items-center border-b border-gray-100 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            {currentStatus.icon}
            {currentStatus.title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Status description */}
          <div
            className={`mb-6 p-4 bg-${currentStatus.color}-50 rounded-lg border border-${currentStatus.color}-100`}
          >
            <p className="text-sm text-gray-700">{currentStatus.description}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="feedback"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {currentStatus.label}
              </label>
              <textarea
                id="feedback"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                rows="4"
                placeholder="Please provide feedback about this status change"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-5 py-2 text-sm font-medium text-white bg-${
                   currentStatus.color
                }-600 rounded-md hover:bg-${
                  currentStatus.color
                }-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${
                 currentStatus.color
                }-500 transition-colors flex items-center`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StatusUpdateModal;
