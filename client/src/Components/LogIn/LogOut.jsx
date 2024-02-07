import React from "react";
import { useNavigate } from "react-router-dom";

export default function LogOut () {
  const navigate = useNavigate();

  function handleLogOut () {
    document.cookie = `userID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    navigate("/")
  }

  return (
    <button 
    onClick={() => handleLogOut()}
    className="logout bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >LogOut</button>
  )
}