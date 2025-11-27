import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CardSlider from "../components/CardSlider";
import styled from "styled-components";
import axios from "axios";

export default function TopRated() {
  const [movies, setMovies] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/top-rated-movies").then((res) => {
      setMovies(res.data);
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY !== 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <h1 className="heading">Top Rated Movies</h1>
        {movieChunks.length > 0 ? (
          <div className="sliders">
            {movieChunks.map((chunk, idx) => (
              <CardSlider key={idx} data={chunk} />
            ))}
          </div>
        ) : (
          <h2 className="loading">Loading top rated movies...</h2>
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
