import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchMovies, getGenres } from "../store";
import SelectGenre from "../components/SelectGenre";
import Slider from "../components/Slider";
import NotAvailable from "../components/NotAvailable";

function TVShows() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);

  // Redux states with safe defaults
  const movies = useSelector((state) => state.netflix.movies) || [];
  const genres = useSelector((state) => state.netflix.genres) || [];
  const genresLoaded = useSelector((state) => state.netflix.genresLoaded);

  // Check for logged-in user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  // Load genres if not loaded
  useEffect(() => {
    if (!genres.length) {
      dispatch(getGenres());
    }
  }, [genres.length, dispatch]);

  // Fetch TV shows once genres are loaded
  useEffect(() => {
    if (genresLoaded) {
      dispatch(fetchMovies({ genres, type: "tv" }));
    }
  }, [genresLoaded, genres, dispatch]);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.pageYOffset !== 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Container>
      <Navbar isScrolled={isScrolled} />
      <div className="data">
        {genres.length > 0 ? <SelectGenre genres={genres} type="tv" /> : null}
        {movies.length > 0 ? <Slider movies={movies} /> : <NotAvailable />}
      </div>
    </Container>
  );
}

const Container = styled.div`
  .data {
    margin-top: 8rem;

    .not-available {
      text-align: center;
      margin-top: 4rem;
      color: white;
    }
  }
`;

export default TVShows;
