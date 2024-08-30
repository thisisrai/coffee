const Home = () => {
  return (
    <div className="home-wrapper">
      <video autoPlay loop muted style={{ width: "100%", height: "auto" }}>
        <source src="coffeejob.mp4" type="video/mp4" />
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