export async function addOrEditAdmin({
  setError,
  isEditing,
  formData,
  logout,
  setAdmins,
  setReload,
  setDepartments,
  departments,
  setFormData,
  setShowForm,
}) {
  setError(null);
  const token = localStorage.getItem("token");
  let url, method;

  if (isEditing) {
    url = `${import.meta.env.VITE_SITE}/superadmin/admins/${currentAdmin._id}`;
    method = "PUT";
  } else {
    url = `${import.meta.env.VITE_SITE}/superadmin/admins`;
    method = "POST";
  }

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        logout();
      }
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    const data = await response.json();

    // Update the admins list
    if (isEditing) {
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin._id === currentAdmin._id ? data : admin
        )
      );
    } else {
      setAdmins((prevAdmins) => [data.admin, ...prevAdmins]);
      // To be removed (Temporary)
      setReload(!reload);
      if (
        data.admin.department &&
        !departments.includes(data.admin.department)
      ) {
        setDepartments([...departments, data.admin.department]);
      }
    }

    // Close the form
    setShowForm(false);
    setFormData({
      username: "",
      password: "",
      fullName: "",
      role: "",
      department: "",
      email: "",
      contactNumber: "",
    });
  } catch (err) {
    setError(err.message);
    console.error(err);
  }
}

export async function deleteAdmin({ adminId, logout, setAdmins, setError }) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_SITE}/superadmin/admins/${adminId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        logout();
      }
      throw new Error(`Error ${response.status}`);
    }

    // Remove admin from state
    setAdmins((prevAdmins) =>
      prevAdmins.filter((admin) => admin._id !== adminId)
    );
  } catch (err) {
    setError(`Failed to delete admin: ${err.message}`);
    console.error(err);
  }
}

export async function toggleAdminActive({
  admin,
  logout,
  setAdmins,
  setError,
}) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_SITE}/superadmin/admins/${admin._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isActive: !admin.isActive,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        logout();
      }
      throw new Error(`Error ${response.status}`);
    }

    const updatedAdmin = await response.json();

    // Update admin in state
    setAdmins((prevAdmins) =>
      prevAdmins.map((a) => (a._id === admin._id ? updatedAdmin : a))
    );
  } catch (err) {
    setError(`Failed to update admin status: ${err.message}`);
    console.error(err);
  }
}
