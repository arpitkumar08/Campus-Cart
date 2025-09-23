import React from 'react'
import Header from '../Components/Header'
import Products from '../Components/ProductsSections/Products'
// import SafetyModal from '../Components/SafetyModal'

const Home = () => {
  return (
    <div className="relative min-h-screen w-full text-white bg-black">
      {/* Dark Background with Radial Top Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.25), transparent 70%), #000000",
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10">
        <Header />
        <Products />
        {/* <SafetyModal /> */}
      </div>
    </div>
  )
}

export default Home
