import React, { useState, useEffect } from "react";
import ComplaintsList from "../../components/Admin/ComplaintsList";
import ComplaintDetail from "../../components/Admin/ComplaintDetail";
import StatusUpdateModal from "../../components/Admin/StatusUpdateModal";
import { fetchAssignedComplaints } from "../../services/api/complaint";

import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";

const AdminManageComplaints = () => {
  const { complaints, setComplaints, auth } = useAuth();

  const [activeView, setActiveView] = useState("list");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState({
    id: null,
    status: "",
  });

  const handleSelectComplaint = (id) => {
    const complaint = complaints.find((c) => c._id === id);
    setSelectedComplaint(complaint);
    setActiveView("detail");
  };

  const openStatusUpdateModal = (id, newStatus) => {
    setPendingStatusUpdate({ id, status: newStatus });
    setStatusModalOpen(true);
  };

  const closeStatusUpdateModal = () => {
    setStatusModalOpen(false);
    setPendingStatusUpdate({ id: null, status: "" });
  };

  const handleStatusUpdate = async (id, newStatus, feedback) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_SITE}/complaint/admin/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            complaintId: id,
            status: newStatus,
            feedback: feedback,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedComplaint = await response.json();

      // Update the local state with the new data
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === id ? updatedComplaint  : complaint
        )
      );

      if (selectedComplaint && selectedComplaint._id === id) {
        setSelectedComplaint(updatedComplaint);
      }

      // Success message
      alert(`Complaint status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating complaint status:", error);
      alert("Failed to update complaint status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToList = () => {
    setActiveView("list");
    setSelectedComplaint(null);
  };

  useEffect(() => {

    fetchAssignedComplaints({
      setIsLoading,
      setComplaints,
      adminId: auth?.userData?.id,
    });
  }, []);

  return (
    <div className="max-w-[1100px] mx-auto my-5 min-h-[70vh] px-2">
      {isLoading ? (
        <div className="min-h-[70vh] flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div>
          {activeView === "list" && (
            <ComplaintsList
              complaints={complaints}
              onSelectComplaint={handleSelectComplaint}
              onStatusUpdate={openStatusUpdateModal}
            />
          )}

          {activeView === "detail" && selectedComplaint && (
            <ComplaintDetail
              complaint={selectedComplaint}
              onBackToList={handleBackToList}
              onStatusUpdate={openStatusUpdateModal}
            />
          )}

          <StatusUpdateModal
            isOpen={statusModalOpen}
            onClose={closeStatusUpdateModal}
            onConfirm={handleStatusUpdate}
            complaintId={pendingStatusUpdate.id}
            statusType={pendingStatusUpdate.status}
          />
        </div>
      )}
    </div>
  );
};

export default AdminManageComplaints;
