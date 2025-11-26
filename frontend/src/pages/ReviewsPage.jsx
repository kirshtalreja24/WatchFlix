import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ReviewsPage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/movies-with-reviews")
      .then((res) => setMovies(res.data))
      .catch(() => setMovies([]));
  }, []);

  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h1>Movies With Reviews</h1>
      {movies.length === 0 && <p>No reviews available</p>}
      <ul>
        {movies.map((movie) => (
          <li key={movie.id} style={{ marginBottom: "1rem" }}>
            <Link to={`/reviews/${movie.id}`}>{movie.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
