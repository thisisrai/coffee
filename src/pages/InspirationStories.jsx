import { useEffect, useState } from "react";
import "../styles/InspirationStories.css";

const InspirationStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch("https://jobrepo.onrender.com/stories");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setStories(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const nextStory = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === stories.length - 1 ? 0 : prevIndex + 1
    );
  };

  const previousStory = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? stories.length - 1 : prevIndex - 1
    );
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;
  if (stories.length === 0) return <div>No stories available.</div>;

  const currentStory = stories[currentIndex];

  return (
    <div className="inspiration-stories">
      <h1>Inspirational Stories</h1>
      <div className="slider-container">
        <button className="slider-button prev" onClick={previousStory}>
          &#8249;
        </button>

        <div className="story-card">
          <h3>{currentStory.content.title}</h3>
          <h4>{currentStory.content.author}</h4>
          {currentStory.content.images &&
            currentStory.content.images.length > 0 && (
              <img
                src={currentStory.content.images[0]}
                alt={currentStory.content.title}
                className="story-image"
              />
            )}
          {currentStory.content.paragraphs.map((paragraph, index) => (
            <p key={index} className="story-paragraph">
              {paragraph}
            </p>
          ))}
        </div>

        <button className="slider-button next" onClick={nextStory}>
          &#8250;
        </button>
      </div>

      <div className="slider-dots">
        {stories.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default InspirationStories;
