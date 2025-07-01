import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/tracks');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTracks(data);
      } catch (error) {
        console.error("Error fetching tracks:", error);
        setError(error);
      }
    };

    fetchTracks();
  }, []);

  if (error) {
    return <div className="App">Error: {error.message}</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Music Store</h1>
        <h2>Tracks</h2>
        {tracks.length === 0 ? (
          <p>No tracks found. Add some tracks to the backend!</p>
        ) : (
          <ul>
            {tracks.map((track) => (
              <li key={track._id}>
                {track.title} by {track.artist} - ${track.price}
              </li>
            ))}
          </ul>
        )}
      </header>
    </div>
  );
}

export default App;