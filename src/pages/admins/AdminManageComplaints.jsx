import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";

// Admin Components ----------------------------------------------
import ComplaintsList from "../../components/Admin/ComplaintsList";
import ComplaintDetail from "../../components/Admin/ComplaintDetail";
import StatusUpdateModal from "../../components/Admin/StatusUpdateModal";

// API Services --------------------------------------------------
import { fetchAssignedComplaints } from "../../services/api/complaint";
import BulkStatusUpdateModal from "../../components/Admin/BulkStatusUpdateModal";

const AdminManageComplaints = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(false);

  // Auth Context data --------------------------------------------
  const { complaints, setComplaints, auth } = useAuth();

  // State for list <-> details navigation ------------------------
  const [activeView, setActiveView] = useState("list");
  const [selectedComplaintForDetails, setSelectedComplaintForDetails] = useState(null);
  const handleSelectComplaintForDetails = (id) => {
    const complaint = complaints.find((c) => c._id === id);
    setSelectedComplaintForDetails(complaint);
    setActiveView("detail");
  };

  // State for Status Update Modal ---------------------------------
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [bulkStatusModalOpen, setBulkStatusModalOpen] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState({
    id: null,
    status: "",
  });
  const [pendingBulkStatusUpdate, setPendingBulkStatusUpdate] = useState({
    ids:[],
    status:""
  })

  const openStatusUpdateModal = (id, newStatus) => {
    setPendingStatusUpdate({ id, status: newStatus });
    setStatusModalOpen(true);
  };

  const openBulkStatusUpdateModal = (ids, newStatus) => {
    setPendingBulkStatusUpdate({ ids, status: newStatus });
    setBulkStatusModalOpen(true);
  };

  const closeStatusUpdateModal = () => {
    setStatusModalOpen(false);
    setPendingStatusUpdate({ id: null, status: "" });
  };

  const closeBulkStatusUpdateModal = () => {
    setBulkStatusModalOpen(false);
    setPendingBulkStatusUpdate({ id: [], status: "" });
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
          complaint._id === id ? updatedComplaint : complaint
        )
      );

      if (selectedComplaintForDetails && selectedComplaintForDetails._id === id) {
        setSelectedComplaintForDetails(updatedComplaint);
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

  const handleBulkStatusUpdate = async (ids, newStatus, feedback) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_SITE}/complaint/admin/bulkStatus`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            complaintIds: ids,
            status: newStatus,
            feedback: feedback,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedComplaint = await response.json();

      alert(`Complaint status updated to ${newStatus}`);
      setReload(!reload);
    } catch (error) {
      console.error("Error updating complaint status:", error);
      alert("Failed to update complaint status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToList = () => {
    setActiveView("list");
    setSelectedComplaintForDetails(null);
  };

  useEffect(() => {
    fetchAssignedComplaints({
      setIsLoading,
      setComplaints,
      adminId: auth?.userData?.id,
    });
  }, [reload]);

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
              onSelectComplaintForView={handleSelectComplaintForDetails}
              onStatusUpdate={openStatusUpdateModal}
              onBulkStatusUpdate={openBulkStatusUpdateModal}
            />
          )}

          {activeView === "detail" && selectedComplaintForDetails && (
            <ComplaintDetail
              complaint={selectedComplaintForDetails}
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

          <BulkStatusUpdateModal
            isOpen={bulkStatusModalOpen}
            onClose={closeBulkStatusUpdateModal}
            onConfirm={handleBulkStatusUpdate}
            complaintIds={pendingBulkStatusUpdate.ids}
            statusType={pendingBulkStatusUpdate.status}
          />
        </div>
      )}
    </div>
  );
};

export default AdminManageComplaints;
