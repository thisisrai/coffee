import { useEffect, useState } from "react";
import "../styles/InspirationStories.css";

const InspirationStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="inspiration-stories">
      <h1>Inspiration Stories</h1>
      <ul>
        {stories.map((story) => (
          <li key={story.id} className="story-card">
            <h3>{story.title}</h3>
            <h4>{story.author}</h4>
            {story.images && story.images.length > 0 && (
              <img src={story.images[0]} alt={story.title} className="story-image" />
            )}
            <p>{story.paragraphs.join(", ")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InspirationStories;
