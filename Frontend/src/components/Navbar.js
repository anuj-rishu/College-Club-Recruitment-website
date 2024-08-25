import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <nav className={` bg-black ${isOpen ? 'bg-black bg-opacity-90' : ''}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center mt-3">
                <Link to="/">
                 <img 
          src="https://via.placeholder.com/60x40" 
          alt="Placeholder" 
          className="rounded-full shadow-lg"
        />
                </Link>
              </div>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4 mt-3">
                <Link to="/">
                  <button className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium">Home</button>
                </Link>
                <Link to="/register">
                  <button className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium">Register</button>
                </Link>
                <Link to="/admin">
                  <button className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium">Admin Login</button>
                </Link>
                
              </div>
            </div>
            <div className="block sm:hidden">
              <button onClick={toggleMenu} className="text-white hover:bg-gray-900 focus:outline-none px-3 py-2">
                <svg className="h-6 mt-3 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 mr-3 ml-3">
              <Link to="/">
                <button onClick={closeMenu} className="text-white block hover:bg-gray-700 px-3 py-2 text-base font-medium border-b border-gray-600 w-full text-left">Home</button>
              </Link>
              <Link to="/register">
                <button onClick={closeMenu} className="text-white block hover:bg-gray-700 px-3 py-2 text-base font-medium border-b border-gray-600 w-full text-left">Register</button>
              </Link>
              <Link to="/admin">
                <button onClick={closeMenu} className="text-white block hover:bg-gray-700 px-3 py-2 text-base font-medium border-b border-gray-600 w-full text-left">Admin Login</button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;