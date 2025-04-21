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

export async function fetchAssignedComplaints({ setIsLoading, setComplaints, adminId }) {
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

export async function postComplaint({
  studentId,
  formData,
  setIsLoading
}) {
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
