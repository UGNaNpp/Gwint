import React, { createContext, useContext } from "react";
import FormInput from "./FormInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const config = require("./../../Resources/config.json")

const FormikContext = createContext();

export const useFormikContext = () => {
  return useContext(FormikContext);
};

export default function LoginDataForm() {
  const navigate = useNavigate();

  function setCookie(name, value, days) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const cookieString = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
    document.cookie = cookieString;
  }
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Incorrect email")
        .min(1, "Must be at least 1 character")
        .max(60, "Must be max 60 characters")
        .required("Required"),
        password: Yup.string()
        .min(5, "Must be at least 5 characters")
        .max(
          100,
          "Seriously, do You want to remember more than 100 characters?"
        )
        .matches(/[0-9]/, "Password requires a number")
        .matches(/[a-z]/, "Password requires a lowercase letter")
        .matches(/[A-Z]/, "Password requires an uppercase letter")
        .matches(/[^\w]/, "Password requires a symbol")
        .required("Required"),
    }),
    onSubmit: (values) => {
      axios
        .post(`${config.serverURL}/login`, values)
        .then(function (response) {
          setCookie("userID", response.data, 30);
          navigate(`/board`); // ! przekierowanie do strony domowej jak powstanie
        })
        .catch(function (error) {
          alert(error);
        });
    },
  });

  return (
    <FormikContext.Provider value={formik}>
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <FormInput name="email" type="email" />
        <FormInput name="password" type="password" />
        <div className="flex items-center justify-between">
          <button
            type="reset"
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            Reset
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Log In
          </button>
        </div>
      </form>
    </FormikContext.Provider>
  );
}
