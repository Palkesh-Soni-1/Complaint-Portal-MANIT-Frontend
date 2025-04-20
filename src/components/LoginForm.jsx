import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

const LoginForm = () => {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("student");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Username and Password are required");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    try {
      setError("");
      await login(username, password, userType);
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col p-5 bg-white rounded-lg shadow-lg text-violet-500">
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <h1 className="my-6 text-3xl font-semibold text-center">Login</h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <select
                className="w-full py-2 text-blue-500 bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-500 px-2 cursor-pointer"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>

            <div className="mb-4">
              <input
                className="w-full py-2 text-blue-500 bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-500 placeholder-violet-400 px-2"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <input
                className="w-full py-2 text-blue-500 bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-500 placeholder-violet-400 px-2"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 mt-4 text-white bg-blue-500 rounded-sm hover:bg-blue-600 font-semibold transition-all"
            >
              Login as {userType.charAt(0).toUpperCase() + userType.slice(1)}
            </button>
            {error ? (
              <div className="text-red-500 text-center mt-4">{error}</div>
            ) : (
              <div className="text-red-500 text-center mt-4"></div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
