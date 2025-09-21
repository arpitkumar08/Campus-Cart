import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  //   const {error, isLoading, verifyEmail} = useAuthStore()

  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // auto move to next
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasted)) return; // only allow numbers
    const newCode = pasted.split("");
    while (newCode.length < 6) newCode.push(""); // pad if less than 6
    setCode(newCode);

    // focus next empty box
    const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
    if (lastFilledIndex < 5) {
      inputRefs.current[lastFilledIndex + 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const verificationCode = code.join("");

    // try {
    //   await verifyEmail(verificationCode)
    //   navigate('/')
    //   toast.success("Email Verified Successfully")

    // } catch (error) {
    //   console.log(error);

    // }
  };

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]); // ✅ auto-submit when all digits filled

  return (
    <div className="relative flex justify-center items-center min-h-screen px-4 bg-zinc-900 overflow-hidden">
      {/* ✨ Subtle shiny greyish overlay */}
      <div className="absolute inset-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-zinc-700 opacity-40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-zinc-600 opacity-30 rounded-full blur-2xl"></div>
      </div>

      {/* Verification Box (unchanged) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md bg-zinc-800 bg-opacity-60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 z-10"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Verify Email
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Enter the 6-digit code sent to your email address.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste} // ✅ enable pasting full code
                className="w-12 h-12 text-center text-2xl font-bold rounded-xl bg-zinc-700 text-white border-2 border-zinc-600 focus:border-purple-500 focus:outline-none transition"
              />
            ))}
          </div>

          {/* {error && <p className="text-red-500 font-semibold mt-2">{error}</p>} */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            // disabled={isLoading || code.some((digit) => !digit)}
            className="w-full py-3 px-4 text-white font-semibold rounded-lg shadow-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all mt-4 cursor-pointer"
            type="submit"
          >
            Verify
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;
