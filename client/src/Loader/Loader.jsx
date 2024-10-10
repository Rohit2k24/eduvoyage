// src/Loader/Loader.jsx
import React from 'react';
import './Loader.css'; // Import Loader styles

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loader;
