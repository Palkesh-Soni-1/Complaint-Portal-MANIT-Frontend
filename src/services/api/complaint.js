export async function fetchAllComplaints({ setIsLoading, setComplaints }) {
  setIsLoading(true);
  try {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(
      `${import.meta.env.VITE_SITE}/complaint/get/all`,
      {
        method: "GET",
        headers: headers,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch complaints");
    }

    const data = await response.json();
    setComplaints(data.data);
  } catch (error) {
    console.error("Error fetching complaints:", error);
  } finally {
    setIsLoading(false);
  }
}

export async function fetchAssignedComplaints({
  setIsLoading,
  setComplaints,
  adminId,
}) {
  setIsLoading(true);
  try {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(
      `${import.meta.env.VITE_SITE}/complaint/get/assigned?adminId=${adminId}`,
      {
        method: "GET",
        headers: headers,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch complaints");
    }

    const data = await response.json();
    setComplaints(data.data);
  } catch (error) {
    console.error("Error fetching complaints:", error);
  } finally {
    setIsLoading(false);
  }
}

export async function fetchComplaintsByStudentId({
  setLoading,
  setComplaints,
  studentId,
  setFilteredComplaints,
}) {
  setLoading(true);
  try {
    const token = localStorage.getItem("site_token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const res = await fetch(
      `${import.meta.env.VITE_SITE}/complaint/get?studentId=${studentId}`,
      {
        method: "GET",
        headers: headers,
      }
    );
    if (res.ok) {
      const data = (await res.json()).data;
      setComplaints(data);
      setFilteredComplaints(data);
    }
  } catch (err) {
    console.log("Failed To Fetch Complaints");
  } finally {
    setLoading(false);
  }
}

export async function fetchComplaintByComplaintId({
  setLoading,
  complaintId,
  studentId,
  setComplaint,
}) {
  setLoading(true);
  const token = localStorage.getItem("site_token");
  fetch(
    `${
      import.meta.env.VITE_SITE
    }/complaint/getById?complaintId=${complaintId}&studentId=${studentId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((res) => res.json())
    .then((json) => setComplaint(json.data))
    .catch((error) => console.log(error))
    .finally(() => setLoading(false));
}

export async function postComplaint({ studentId, formData, setIsLoading }) {
  try {
    setIsLoading(true);
    const token = localStorage.getItem("site_token");
    const res = await fetch(
      `${import.meta.env.VITE_SITE}/complaint/post?studentId=${studentId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      }
    );
    if (res.ok) {
      setIsLoading(false);
      alert("Complaint Submitted Successfully");
      // console.log(await res.json())
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    setIsLoading(false);
  }
}

export async function getOpenComplaints({
  setLoading,
  setError,
  logout,
  setComplaints,
  setFilteredComplaints,
}) {
  try {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_SITE}/complaint/get/open`,
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

    const res = await response.json();
    // console.log(res);
    setComplaints(res.data);
    setFilteredComplaints(res.data);
  } catch (err) {
    setError(`Failed to fetch complaints: ${err.message}`);
    console.error(err);
  } finally {
    setLoading(false);
  }
}


export async function assignComplaintToAdmin({
  setAdminLoading,
  selectedComplaint,
  adminId,
  setComplaints,
  closeAdminModal,
  setReload,
  reload
}) {
  try {
    setAdminLoading(true);
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_SITE}/complaint/intermediate/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          complaintId: selectedComplaint._id,
          status: "assigned",
          adminId: adminId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // Update local state
    setComplaints((prevComplaints) =>
      prevComplaints.map((c) =>
        c._id === selectedComplaint._id
          ? { ...c, status: "assigned", assigned: true, assignedTo: adminId }
          : c
      )
    );

    closeAdminModal();
    // setReload(!reload);
  } catch (err) {
    setError(`Failed to assign complaint: ${err.message}`);
    console.error(err);
  } finally {
    setAdminLoading(false);
  }
}


export async function bulkAssignComplaintsToAdmin({
  setAdminLoading,
  complaintIds,
  adminId,
  closeModal,
  setReload,
  reload,
}) {
  try {
    setAdminLoading(true);
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_SITE}/complaint/intermediate/bulkStatus`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          complaintIds,
          status: "assigned",
          adminId: adminId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    closeModal();
    setReload(!reload);
  } catch (err) {
    setError(`Failed to assign complaint: ${err.message}`);
    console.error(err);
  } finally {
    setAdminLoading(false);
  }
}

export async function intermediateRejectComplaint({
  complaint,
  setComplaints,
  setError
}){
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_SITE}/complaint/intermediate/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          complaintId: complaint._id,
          status: "rejected",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // Update local state
    setComplaints((prevComplaints) =>
      prevComplaints.map((c) =>
        c._id === complaint._id ? { ...c, status: "rejected" } : c
      )
    );
  } catch (err) {
    setError(`Failed to reject complaint: ${err.message}`);
    console.error(err);
  }
}

export async function intermediateBulkRejectComplaints({
  complaintIds,
  setError
}){
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_SITE}/complaint/intermediate/bulkStatus`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          complaintIds,
          status: "rejected",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  } catch (err) {
    setError(`Failed to reject complaint: ${err.message}`);
    console.error(err);
  }
}