export async function getAllIntermediateAdmins({
  setAdminLoading,
  logout,
  setAdmins,
  setFilteredAdmins,
  setDepartments,
  setError,
}) {
  try {
    setAdminLoading(true);
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_SITE}/intermediate/admins`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        logout();
      }
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    setAdmins(data);
    setFilteredAdmins(data);

    // Extract unique departments
    const uniqueDepartments = [
      ...new Set(data.map((admin) => admin.department)),
    ];
    setDepartments(uniqueDepartments);
  } catch (err) {
    setError(`Failed to fetch admins: ${err.message}`);
    console.error(err);
  } finally {
    setAdminLoading(false);
  }
}

export async function getAllSuperadminAdmins({
  setLoading,
  setError,
  setAdmins,
  setFilteredAdmins,
  setDepartments,
}) {
  try {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_SITE}/superadmin/admins`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        logout();
      }
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    setAdmins(data);
    setFilteredAdmins(data);

    const uniqueDepartments = [
      ...new Set(data.map((admin) => admin.department)),
    ];
    setDepartments(uniqueDepartments);

    setError(null);
  } catch (err) {
    setError(`Failed to fetch admins: ${err.message}`);
    console.error(err);
  } finally {
    setLoading(false);
  }
}

export async function updateComplaintStatus({
  setIsLoading,
  id,
  newStatus,
  feedback,
  setComplaints,
  selectedComplaintForDetails,
  setSelectedComplaintForDetails,
}) {
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
}

export async function bulkUpdateComplaintStatus({
  setIsLoading,
  ids,
  newStatus,
  feedback,
  setReload,
  reload
}) {
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
  } catch (error) {
    console.error("Error updating complaint status:", error);
    alert("Failed to update complaint status");
  } finally {
    setIsLoading(false);
    setReload(!reload);
  }
}
