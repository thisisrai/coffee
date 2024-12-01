import React from "react";
import "../styles/NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <img
        src="https://media.giphy.com/media/3o7aD2sa1g0g0g0g0g/giphy.gif" // Replace with your cute animated figure URL
        alt="Cute Not Found"
        className="not-found-image"
      />
      <p>Oops! Looks like you took a wrong turn.</p>
    </div>
  );
};

export default NotFound;
