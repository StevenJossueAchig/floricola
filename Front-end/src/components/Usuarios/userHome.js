import React, { Component, useEffect, useState } from "react";
import "../../App.css";
export default function UserHome({ userData }) {
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./login";
  };
  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
      <h3>Welcome User</h3>

      </div>
    </div>
  );
}




