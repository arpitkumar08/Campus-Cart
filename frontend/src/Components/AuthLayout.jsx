import React from 'react'

const AuthLayout = ({ children }) => {
  return (
    <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 min-h-screen flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="max-w-lg border border-zinc-700/40 backdrop-blur-sm bg-zinc-900/50 p-6 lg:p-8 rounded-xl shadow-lg text-center lg:text-left">
          <h1 className="font-extrabold text-4xl lg:text-5xl leading-snug">
            <span className="text-white">Campus</span>{' '}
            <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Exchange
            </span>
          </h1>
          <h3 className="text-lg lg:text-xl text-gray-200 mt-4 lg:mt-6">
            Buy, Sell & Connect with Students Near You.
          </h3>
          <p className="text-gray-400 mt-3 lg:mt-4 text-base lg:text-lg">
            Trade books, gadgets, and more in a safe and seamless way, right
            within your college community.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-zinc-950 rounded-t-3xl lg:rounded-l-3xl lg:rounded-t-none shadow-2xl">
        <div className="w-full max-w-sm sm:max-w-md p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
