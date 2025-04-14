import React, { useState, useEffect } from "react";
import ComplaintsList from "../../components/ComplaintsList";
import ComplaintDetail from "../../components/ComplaintDetail";
import { useAuth } from "../../context/AuthContext";
const AdminManageComplaints = () => {
  const [activeView, setActiveView] = useState("list");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const {complaints, setComplaints} = useAuth();


  const handleSelectComplaint = (id) => {
    const complaint = complaints.find((c) => c._id === id);
    setSelectedComplaint(complaint);
    setActiveView("detail");
  };

  const handleStatusUpdate = async (id, newStatus) => {
    setComplaints(
      complaints.map((complaint) =>
        complaint._id === id ? { ...complaint, status: newStatus } : complaint
      )
    );

    if (selectedComplaint && selectedComplaint._id === id) {
      setSelectedComplaint({ ...selectedComplaint, status: newStatus });
    }
    try {
      // Show loading state if needed
      // setIsLoading(true);
      
      // Call the API to update the status
      const response = await fetch(`${import.meta.env.VITE_SITE}/complaint/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          complaintId: id,
          status: newStatus,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
      const updatedComplaint = await response.json();
      
      // Update the local state with the new data
      setComplaints(prevComplaints => 
        prevComplaints.map(complaint => 
          complaint._id === id 
            ? { ...complaint, status: newStatus } 
            : complaint
        )
      );
      
      // Show success message
      alert(`Complaint status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating complaint status:', error);
      alert('Failed to update complaint status');
    } finally {
      // setIsLoading(false);
    }
  };

  const handleBackToList = () => {
    setActiveView("list");
    setSelectedComplaint(null);
  };

  useEffect(()=>{
    const fetchComplaints = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SITE}/complaint/get/all`);
        if (!response.ok) {
          throw new Error('Failed to fetch complaints');
        }
        const data = await response.json();
        setComplaints(data.data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };

    fetchComplaints();
  },[]);

  return (
    <div className="max-w-[1100px] mx-auto my-5 min-h-[50vh] px-2">
      {activeView === "list" && (
        <ComplaintsList
          complaints={complaints}
          onSelectComplaint={handleSelectComplaint}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      {activeView === "detail" && selectedComplaint && (
        <ComplaintDetail
          complaint={selectedComplaint}
          onBackToList={handleBackToList}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

export default AdminManageComplaints;
