import React from 'react';

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <header className="w-full bg-neutral-300 p-4 text-white text-center">
        <h1 className="text-3xl font-bold">Welcome to Our Website</h1>
      </header>
      <main className="flex flex-col items-center justify-center flex-1 p-4">
        <h2 className="text-2xl font-semibold mb-4">Discover Amazing Features</h2>
        <p className="text-center mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
        </p>
        <img 
          src="https://via.placeholder.com/600x400" 
          alt="Placeholder" 
          className="w-full max-w-md mb-8 rounded shadow-lg"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Get Started
        </button>
      </main>
  
    </div>
  );
};

export default HeroSection;