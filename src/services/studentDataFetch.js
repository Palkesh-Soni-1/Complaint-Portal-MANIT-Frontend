async function studentLogin({ username, password }) {
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
    console.log("Login successful:", data);
    localStorage.setItem("token",data.token);
    return data;
  } catch (err) {
    console.error("Login error:", err);
    // Handle error scenarios, such as showing an error message to the user
  }
}

async function studentProfile({ uid }) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("https://erpapi.manit.ac.in/api/student_profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        uid
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Student Profile fetch successful:", data);
    return data;
  } catch (err) {
    console.error("Student Profile fetch error:", err);
  }
}

async function studentProfileCheck({ uid }) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("https://erpapi.manit.ac.in/api/student_profile_check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        uid
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Student Profile fetch successful:", data);
    return data;
  } catch (err) {
    console.error("Student Profile fetch error:", err);
  }
}

async function studentResult({ uid }) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("https://erpapi.manit.ac.in/api/student_result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        uid
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Student Profile fetch successful:", data);
    return data;
  } catch (err) {
    console.error("Student Profile fetch error:", err);
    throw err;
  }
}

export { studentLogin, studentProfile, studentProfileCheck, studentResult };