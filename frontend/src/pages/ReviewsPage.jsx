import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

export default function ReviewsPage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/movies-with-reviews")
      .then((res) => setMovies(res.data))
      .catch(() => setMovies([]));
  }, []);

  return (
    <Container>
      <h1>Movies With Reviews</h1>

      {movies.length === 0 ? (
        <p className="message">No reviews available</p>
      ) : (
        <MoviesGrid>
          {movies.map((movie) => (
            <MovieCard key={movie.id}>
              <Link to={`/reviews/${movie.id}`}>{movie.title}</Link>
            </MovieCard>
          ))}
        </MoviesGrid>
      )}
    </Container>
  );
}

const Container = styled.div`
  padding: 3rem 2rem;
  color: white;
  min-height: 100vh;
  background: linear-gradient(180deg, #141414 0%, #1c1c1c 100%);

  h1 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2.2rem;
    font-weight: bold;
  }

  .message {
    text-align: center;
    font-size: 1.2rem;
    color: #bbb;
  }
`;

const MoviesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
`;

const MovieCard = styled.div`
  background: #222;
  padding: 1.2rem;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.7);
  }

  a {
    color: white;
    text-decoration: none;
    font-weight: bold;
    font-size: 1.1rem;
    transition: color 0.3s;

    &:hover {
      color: #f34242;
    }
  }
`;
