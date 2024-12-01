import React from "react";
import backgroundVideo from "../assets/videos/coffeejob.mp4";

const Home = (props) => {
  return (
    <div className="home">
      <video autoPlay loop muted className="background-video">
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="home-container">
        <p>
          Welcome to our beta job search tracker application! By creating an
          account, you acknowledge that the application and its owner are not
          responsible for any issues that may arise.
        </p>
      </div>
    </div>
  );
};

export default Home;
