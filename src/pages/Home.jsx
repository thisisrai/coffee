const Home = () => {
  return (
    <div className="home-wrapper">
      <div className="home-container">
        <div className="border-blur"></div>
        <p>
          Welcome to our beta job search tracker application! By creating an
          account, you acknowledge that the application and its owner are not
          responsible for any issues that may arise.
        </p>
        <video
          className="background-video"
          src="coffeejob.mp4"
          autoPlay
          loop
          muted
        ></video>
      </div>
    </div>
  );
};

export default Home;
