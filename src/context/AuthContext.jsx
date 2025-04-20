import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Auth Functions ---------------------------------------------
import {
  studentLogin,
  getStudentSiteToken,
  loginAdmin,
  loginSuperAdmin,
  loginIntermediate,
} from "../services/api/auth";


const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Initial Auth State -------------------------------------------
const initAuth={
  isAuthenticated:false,
  userData:null,
  token:null,
  role:"public"
}

// Provider ------------------------------------------------------
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(initAuth);
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studentId,setStudentId] = useState();
  const navigate = useNavigate();

  // Initialize If already stored auth
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
    setIsLoading(false);
  }, []);

  // Login
  const login = async (username, password, userType) => {
    setIsLoading(true);
    try { 
      // Student -------------------------------------------
      if(userType==="student"){
        const res = await studentLogin({username,password});
        if(res?.token==null){
          setAuth(initAuth);
          return;
        }
        const authData = {
          isAuthenticated:true,
          userData: res,
          token: res?.token,
          role: "student",
        };

        setAuth(authData);
        localStorage.setItem("auth", JSON.stringify(authData));
      }
      // Admin ------------------------------------------------
      else if(userType==="admin"){
        const res = await loginAdmin({ username, password });
        if(res){
          const authData = {
            isAuthenticated:true,
            userData: res.admin,
            token: res?.token,
            role: "admin",
          };
          setAuth(authData);
          localStorage.setItem("auth", JSON.stringify(authData));
        }
      }
      // SuperAdmin ----------------------------------------------
      else if(userType==="superadmin"){
        const res = await loginSuperAdmin({ username, password });
        if(res){
          const authData = {
            isAuthenticated:true,
            userData: res.superAdmin,
            token: res?.token,
            role: "superadmin",
          };
          setAuth(authData);
          localStorage.setItem("auth", JSON.stringify(authData));
        }
      }
      // Intermediate ---------------------------------------------
      else if(userType==="intermediate"){
        const res = await loginIntermediate({ username, password });
        if (res) {
          const authData = {
            isAuthenticated: true,
            userData: res.intermediate,
            token: res?.token,
            role: "intermediate",
          };
          setAuth(authData);
          localStorage.setItem("auth", JSON.stringify(authData));
        }
      }
    }
    catch (error) {
      console.error("Login error:", error);
      setAuth(initAuth);
      localStorage.removeItem("auth");
      localStorage.removeItem("token");
      throw error;
    }
    finally{
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    // Site token for student authorization
    const makeSiteToken=async()=>{
      setIsLoading(true);
      try {
        const res = await getStudentSiteToken({
          studentId: auth?.userData?.userInfo?.uid,
          logout,
        });
      } catch (err) {
        console.log("Error: ", err);
      } finally {
        setIsLoading(false);
      }
    }

    if((auth.isAuthenticated) && auth?.role==="student"){
      setStudentId(auth?.userData?.userInfo?.uid);
      makeSiteToken();
    }
  },[auth])

  const logout = () => {
    setAuth(initAuth);
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    if ((auth.isAuthenticated===false) && !isLoading) {
      navigate("/");
    }
  }, [auth, navigate, isLoading]);

  return (
    <AuthContext.Provider
      value={{ auth, login, logout, isLoading, setIsLoading,complaints, setComplaints,studentId }}
    >
      {children}
    </AuthContext.Provider>
  );
};