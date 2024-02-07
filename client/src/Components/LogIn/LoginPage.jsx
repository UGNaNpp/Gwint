import React, {useEffect} from "react";
import LoginDataForm from "./LoginDataForm";
import { useNavigate } from "react-router-dom";


export default function LoginPage () {
  const navigate = useNavigate();

  const goToRegisterPage = () => {
    navigate("/Register")
  }

  const getCookie = (name) => {
    const cookies = document.cookie.split(';');
    const cookie = cookies.find(cookie => cookie.trim().startsWith(name + '='));
    return cookie ? cookie.split('=')[1] : null;
  };
  
  useEffect(() => {
    function loginIfCookieExists() {
      const userID = getCookie("userID");
      if (userID != null) {
        navigate(`/mainPage/${userID}`);
      }
    }

    loginIfCookieExists();
  }, [navigate]);

  return (
    <div
    className="login-component w-full max-w-xs">
      <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
      onClick={()=> goToRegisterPage()}
      >Register</button>
      <LoginDataForm />
    </div>
    )
}