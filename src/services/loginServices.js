export async function loginAdmin({ username, password }) {
  try {
    const response = await fetch("http://localhost:3000/admin/login", {
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
    const response = await fetch("http://localhost:3000/superadmin/login", {
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
