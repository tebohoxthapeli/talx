import { useDataLayerValue } from "./DataLayer";
import React from "react";


const useContextMethods = () => {
  const [{ user }, dispatch] = useDataLayerValue();

  const logout = () => {
    if (localStorage.getItem("jwtToken")) {
      localStorage.removeItem("jwtToken");
      dispatch({ type: "LOGOUT" });
    }
  };

  const login = (userData) => {
    logout();
    localStorage.setItem("jwtToken", userData.token);

    dispatch({
      type: "LOGIN",
      payload: userData,
    });
  };
  
  return {
    user,
    login,
    logout,
  };
};

export { useContextMethods };
