import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CardSlider from "../components/CardSlider";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { fetchPopularMovies } from "../store/index";

export default function Popular() {
  const dispatch = useDispatch();
  const [isScrolled, setIsScrolled] = useState(false);

  const movies = useSelector((state) => state.netflix.movies);

  useEffect(() => {
    dispatch(fetchPopularMovies());
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY !== 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Split movies into chunks of 10–15
  const chunkMovies = (arr, size = 15) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const movieChunks = chunkMovies(movies, 15);

  return (
    <Container>
      <Navbar isScrolled={isScrolled} />

      <div className="content">
        <h1 className="heading">Popular Movies</h1>

        {movieChunks.length > 0 ? (
          <div className="sliders">
            {movieChunks.map((chunk, idx) => (
              <CardSlider
                key={idx}
                data={chunk}
                // title={`Popular Movies ${idx + 1}`}
              />
            ))}
          </div>
        ) : (
          <h2 className="loading">Loading popular movies...</h2>
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  .heading {
    color: white;
    margin-top: 7rem;
    margin-left: 4rem;
  }
  .loading {
    color: white;
    margin-top: 5rem;
    margin-left: 4rem;
  }
`;
