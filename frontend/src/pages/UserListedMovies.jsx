import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { getUsersLikedMovies } from "../store";

export default function UserListedMovies() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);

  // Lazy initialization to read from localStorage only once
  const [user] = useState(() => JSON.parse(localStorage.getItem("user")));
  const email = user?.email;

 
  const movies = useSelector((state) => state.netflix.movies) ?? [];
  const loading = useSelector((state) => state.netflix.loading) ?? false;

  // Redirect to login if no user
  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  // Fetch user's liked movies once
  useEffect(() => {
    if (email) {
      dispatch(getUsersLikedMovies(email));
    }
  }, [email, dispatch]);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.pageYOffset !== 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Container>
      <Navbar isScrolled={isScrolled} />
      <div className="content flex column">
        <h1>My List</h1>
        <div className="grid flex">
          {loading ? (
            <p style={{ color: "white", marginLeft: "3rem" }}>Loading...</p>
          ) : movies.length === 0 ? (
            <p style={{ color: "white", marginLeft: "3rem" }}>
              No movies in your list yet.
            </p>
          ) : (
            movies.map((movie, index) => (
              <Card
                movieData={movie}
                index={index}
                key={movie.id}
                isLiked={true} // show "remove" icon
              />
            ))
          )}
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  .content {
    margin: 2.3rem;
    margin-top: 8rem;
    gap: 3rem;

    h1 {
      margin-left: 3rem;
    }

    .grid {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
  }
`;
