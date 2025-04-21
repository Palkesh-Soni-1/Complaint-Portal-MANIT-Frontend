import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";
import ReCAPTCHA from "react-google-recaptcha";

const LoginForm = () => {
  const { login } = useAuth();
  const [isLoading,setIsLoading]=useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("student");
  const [error, setError] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleCaptchaChange = (value) => {
    setCaptchaVerified(!!value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Username and Password are required");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    if (!captchaVerified) {
      setError("Please verify the CAPTCHA");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await login(username, password, userType);
      // Reset captcha after successful login
      setCaptchaVerified(false);
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      // Reset captcha after failed login
      setCaptchaVerified(false);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
    finally{
      setIsLoading(false);
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
                <option value="intermediate">Intermediate</option>
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

            {/* Google reCAPTCHA v2 */}
            <div className="w-full flex justify-center mb-4">
              <ReCAPTCHA
                sitekey={`${import.meta.env.VITE_SITE_KEY}`}
                onChange={handleCaptchaChange}
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2 mt-4 text-white rounded-sm font-semibold transition-all ${
                captchaVerified
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-blue-300 cursor-not-allowed"
              }`}
              disabled={!captchaVerified}
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
