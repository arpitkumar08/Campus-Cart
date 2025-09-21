import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'

const Input = ({ value, placeholder, onChange, type = "text", label }) => {
  const [showPassword, setShowPassword] = useState(false)

  const toggleShowPassword = () => setShowPassword((prev) => !prev)

  return (
    <div className="relative w-full space-y-1">
      <label className="text-sm font-semibold text-white">{label}</label>

      <input
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pr-10 input-box outline-none"
      />

      {type === "password" && (
        <div
          className="absolute right-3 top-9 text-slate-400 hover:text-primary cursor-pointer"
          onClick={toggleShowPassword}
        >
          {showPassword ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}
        </div>
      )}
    </div>
  )
}

export default Input
