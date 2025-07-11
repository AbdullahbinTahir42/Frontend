import React from 'react';
import remotelogo from '../assets/GOOnline.jpg'; // adjust the path based on your file location

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="flex items-center px-6 py-4">
        <img
          src={remotelogo}
          alt="Logo"
          className="w-20 h-20 mr-3"
        />
        <h1 className="text-2xl font-bold text-[#fe9350]">go.Online</h1>
      </div>
      <hr className="border-t-4 border-[#1a144f] w-full" />
    </div>
  );
};

export default Navbar;
