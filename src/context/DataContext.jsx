import React, { createContext, useState, useEffect, useContext } from "react";

const DataContext = createContext();
export const useData = () => useContext(DataContext);

import {
  studentProfileCheck,
  studentResult,
  studentProfile,
} from "../services/api/studentdata"
import infoConverter from "../services/repository/transformStudentInfo";
import { useAuth } from "./AuthContext";


export const DataProvider = ({ children }) => {
  
  const {auth,logout} =useAuth();
  const [info,setInfo] = useState(null);
  const [isLoadingData,setIsLoadingData] =useState(false);

  useEffect(()=>{
    const fun = async()=>{
      setIsLoadingData(true);
      const rollNo = auth?.userData?.userInfo?.studentInfo?.[0]?.roll_no;
      if (!rollNo) return;
      try {
        let information = {};
        information.basicInfo = auth?.userData;
        let data = await studentProfile({uid:rollNo})
        information.profileImage=data;
        data = await studentProfileCheck({uid:rollNo})
        information.advancedInfo=data;
        data = await studentResult({uid:rollNo})
        information.resultData=data;
        // console.log("information:",information)

        setInfo(infoConverter(information))
      } catch (err) {
        console.log("Failed to fetch dur to: ",err);
        logout();
      }
      finally{
        setIsLoadingData(false);
      }
    }
    if((auth.isAuthenticated) && auth?.role==="student"){
      fun();
    }
  },[auth])

  return (
    <DataContext.Provider
      value={{ info,isLoadingData }}
    >
      {children}
    </DataContext.Provider>
  );
};