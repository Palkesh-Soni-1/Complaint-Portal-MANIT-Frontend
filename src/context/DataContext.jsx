import React, { createContext, useState, useEffect, useContext } from "react";

const DataContext = createContext();
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  




  return (
    <DataContext.Provider
      value={{ studentData,setStudentdata }}
    >
      {children}
    </DataContext.Provider>
  );
};