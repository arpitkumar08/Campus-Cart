import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { IoMdMail } from "react-icons/io"
import { Link } from 'react-router-dom'
import { FaArrowLeft } from "react-icons/fa"
import { Loader } from "lucide-react"
import Input from '../../Components/Input'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  // const { isLoading, forgotPassword } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    // await forgotPassword(email)
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-zinc-900/60 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-zinc-700/40"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Forgot Password
          </h2>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <p className="text-gray-300 mb-6 text-center">
                Enter your email address and we’ll send you a link to reset your password.
              </p>

              <Input
                icon={<IoMdMail />}
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 text-white font-semibold rounded-lg shadow-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all mt-4 cursor-pointer"
                type="submit"
              >
                {/* {isLoading ? (
                  <Loader className="size-6 animate-spin mx-auto" />
                ) : (
                  "Send Reset Link"
                )} */}
                Send Reset Link
              </motion.button>
            </form>
          ) : (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <IoMdMail className="h-8 w-8 text-white" />
              </motion.div>
              <p className="text-gray-300 mb-6">
                If an account exists for <span className="text-purple-400">{email}</span>, you will receive a password reset link shortly.
              </p>
            </div>
          )}
        </div>

        <div className="px-8 py-4 bg-zinc-950/70 flex justify-center">
          <Link
            to="/login"
            className="text-sm text-purple-400 hover:underline flex items-center"
          >
            <FaArrowLeft className="h-4 w-4 mr-2" /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPasswordPage
