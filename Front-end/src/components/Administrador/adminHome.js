import React, { useEffect, useState } from "react";
import { faTrash,faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../App.css";
export default function AdminHome({}) {


  //logout
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./login";
  };


  return (
    <div className="auth-wrapper" style={{ height: "auto", marginTop: 50 }}>
      <div className="auth-inner" style={{ width: "fit-content" }}>
        <h3>Welcome Admin</h3>
        
      </div>
    </div>
  );
}
