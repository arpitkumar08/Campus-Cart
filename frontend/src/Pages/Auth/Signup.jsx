import React, { useState } from 'react'
import AuthLayout from '../../Components/AuthLayout'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../Components/Input'
import { useAuthStore } from '../../store/useAuthStore'
import PasswordStrengthMeter from '../../Components/PasswordStrengthMeter'
import { Loader } from 'lucide-react'


const Signup = () => {

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const { signup, isLoading } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setError("")
    try {
      await signup(fullName, email, password)
    } catch (error) {
      console.log(error)
    }
    navigate("/verify-email")
  }

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' },
    }),
  }
  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-md mx-auto flex flex-col items-center justify-center min-h-[80vh] space-y-8"
      >
        <motion.h3
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent"
        >
          Create Your Account
        </motion.h3>

        <form className="w-full space-y-5" onSubmit={handleSubmit}>
          <motion.div variants={formVariants} initial="hidden" animate="visible" custom={1}>
            <Input
              value={fullName}
              placeholder="John Wick"
              label="Full Name"
              onChange={(e) => setFullName(e.target.value)}
              type="text"
            />
          </motion.div>
          <motion.div variants={formVariants} initial="hidden" animate="visible" custom={1}>
            <Input
              value={email}
              placeholder="example@demo.com"
              label="Email Address"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </motion.div>

          <motion.div variants={formVariants} initial="hidden" animate="visible" custom={2}>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              placeholder="Min 8 Characters"
              type="password"
            />
          </motion.div>

          <PasswordStrengthMeter password={password} />

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-red-400 text-sm"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            variants={formVariants}
            initial="hidden"
            animate="visible"
            custom={3}
            type="submit"
            className="w-full py-2.5 cursor-pointer rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold tracking-wide shadow-md transition-all"
            disabled={isLoading}
          >
            {isLoading ? <Loader className='animate-spin mx-auto' size={24} /> : "SIGN UP"}
          </motion.button>

          <motion.p
            variants={formVariants}
            initial="hidden"
            animate="visible"
            custom={5}
            className="text-gray-400 text-sm mt-3"
          >
            Already have an account{" "}
            <span
              onClick={() => navigate('/login')}
              className="text-purple-400 cursor-pointer hover:underline"
            >
              Login
            </span>
          </motion.p>
        </form>
      </motion.div>
    </AuthLayout>
  )
}

export default Signup
