import React, { createContext, useState, useEffect, useContext } from "react";

const DataContext = createContext();
export const useData = () => useContext(DataContext);


import { studentProfileCheck, studentResult } from "../services/studentDataFetch";
import { studentProfile } from "../services/studentDataFetch";
import { useAuth } from "./AuthContext";
import infoConverter from "../services/studentInfoConversion";

export const DataProvider = ({ children }) => {
  
  const {auth} =useAuth();

  const [info,setInfo] = useState(null);

  useEffect(()=>{
    const fun = async()=>{
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
        console.log("information:",information)

        setInfo(infoConverter(information))
      } catch (err) {
        console.log("Failed to fetch dur to: ",err);
      }
    }
    if(auth){
      fun();
    }
  },[auth])

  return (
    <DataContext.Provider
      value={{ info }}
    >
      {children}
    </DataContext.Provider>
  );
};