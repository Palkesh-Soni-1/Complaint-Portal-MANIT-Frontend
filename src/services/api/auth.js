export async function loginAdmin({ username, password }) {
  try {
    const response = await fetch(`${import.meta.env.VITE_SITE}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    localStorage.setItem("token", data.token);
    return data;
  } catch (err) {
    console.error("Login error:", err);
  }
}

export async function loginIntermediate({ username, password }) {
  try {
    const response = await fetch(`${import.meta.env.VITE_SITE}/intermediate/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    localStorage.setItem("token", data.token);
    return data;
  } catch (err) {
    console.error("Login error:", err);
  }
}

export async function loginSuperAdmin({ username, password }) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SITE}/superadmin/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    localStorage.setItem("token", data.token);
    return data;
  } catch (err) {
    console.error("Login error:", err);
  }
}

export async function studentLogin({ username, password }) {
  try {
    const response = await fetch("https://erpapi.manit.ac.in/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    return data;
  } catch (err) {
    console.error("Login error:", err);
  }
}

export async function getStudentSiteToken({ studentId, logout }) {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const response = await fetch(`${import.meta.env.VITE_SITE}/generateToken`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        studentId: studentId,
      }),
    });

    if (!response.ok) {
      logout();
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    localStorage.setItem("site_token", data.site_token);
    return data;
  } catch (err) {
    logout();
    console.error("Login error:", err);
  }
}
