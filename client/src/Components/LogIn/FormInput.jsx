import React from 'react';
import { useFormikContext } from "./LoginDataForm";

export default function FormInput ({name, type}) {
  const formik = useFormikContext();

  return (
    <div>
      <label htmlFor={name}
      className='block text-gray-700 text-sm font-bold mb-2'
      >{name}</label>
      <input
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          id={name}
          type={type}
          {...formik.getFieldProps(name)}
      />
      {formik.touched[name] && formik.errors[name] ? (
          <div className='text-red-500 text-xs italic'
          >{formik.errors[name]}</div>
      ) : null}
    </div>
  )
}