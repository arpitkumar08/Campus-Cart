import React from 'react';
import Header from '../Components/Header';
import Products from '../Components/ProductsSections/Products';

const Home = () => {
  return (
    <div className="relative min-h-screen w-full text-white bg-black overflow-hidden">
      {/* Background Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.15), transparent 70%), #000000`,
        }}
      />
      {/* Main Content */}
      <div className="relative z-10 flex flex-col gap-10">
        <Header />
        <Products />
      </div>
    </div>
  );
};

export default Home;
