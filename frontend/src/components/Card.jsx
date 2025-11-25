import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IoPlayCircleSharp } from "react-icons/io5";
import { AiOutlinePlus } from "react-icons/ai";
import { RiThumbUpFill, RiThumbDownFill } from "react-icons/ri";
import { BiChevronDown } from "react-icons/bi";
import { BsCheck } from "react-icons/bs";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getUsersLikedMovies, removeMovieFromLiked } from "../store";
import video from "../assets/video.mp4";

export default React.memo(function Card({ index, movieData, isLiked = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [feedback, setFeedback] = useState(""); // for visual feedback

  // Get logged-in user's email from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  const showFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(""), 2000); // clear after 2 seconds
  };

  // Add movie to liked movies  
  const addToList = async () => {
    if (!email) return showFeedback("Please log in first!");
    try {
      await axios.post(
        "http://localhost:5000/liked-movies",
        { email, movie: movieData },
        { withCredentials: true }
      );
      dispatch(getUsersLikedMovies(email)); // refresh liked movies
      showFeedback("Movie added to liked list!");
    } catch (error) {
      console.log(error);
      showFeedback("Failed to add movie.");
    }
  };

  // Remove movie from liked movies
  const removeFromList = async () => {
    if (!email) return showFeedback("Please log in first!");
    try {
      await axios.delete(
        "http://localhost:5000/liked-movies",
        { data: { email, movieId: movieData.id }, withCredentials: true }
      );
      dispatch(removeMovieFromLiked({ movieId: movieData.id, email }));
      showFeedback("Movie removed from liked list!");
    } catch (error) {
      console.log(error);
      showFeedback("Failed to remove movie.");
    }
  };

  return (
    <Container
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
        alt="card"
        onClick={() => navigate("/player")}
      />

      {isHovered && (
        <div className="hover">
          <div className="image-video-container">
            <img
              src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
              alt="card"
              onClick={() => navigate("/player")}
            />
            <video
              src={video}
              autoPlay
              loop
              muted
              onClick={() => navigate("/player")}
            />
          </div>
          <div className="info-container flex column">
            <h3 className="name" onClick={() => navigate("/player")}>
              {movieData.name}
            </h3>
            <div className="icons flex j-between">
              <div className="controls flex">
                <IoPlayCircleSharp
                  title="Play"
                  onClick={() => navigate("/player")}
                />
                <RiThumbUpFill title="Like" />
                <RiThumbDownFill title="Dislike" />
                {isLiked ? (
                  <BsCheck title="Remove from List" onClick={removeFromList} />
                ) : (
                  <AiOutlinePlus title="Add to my list" onClick={addToList} />
                )}
              </div>
              <div className="info">
                <BiChevronDown title="More Info" />
              </div>
            </div>
            <div className="genres flex">
              <ul className="flex">
                {movieData.genres.map((genre) => (
                  <li key={genre}>{genre}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {feedback && <Feedback>{feedback}</Feedback>}
    </Container>
  );
});

const Container = styled.div`
  max-width: 230px;
  width: 230px;
  height: 100%;
  cursor: pointer;
  position: relative;

  img {
    border-radius: 0.2rem;
    width: 100%;
    height: 100%;
    z-index: 10;
  }

  .hover {
    z-index: 99;
    height: max-content;
    width: 20rem;
    position: absolute;
    top: -18vh;
    left: 0;
    border-radius: 0.3rem;
    box-shadow: rgba(0, 0, 0, 0.75) 0px 3px 10px;
    background-color: #181818;
    transition: 0.3s ease-in-out;

    .image-video-container {
      position: relative;
      height: 140px;

      img,
      video {
        width: 100%;
        height: 140px;
        object-fit: cover;
        border-radius: 0.3rem;
        top: 0;
        position: absolute;
      }

      video {
        z-index: 5;
      }

      img {
        z-index: 4;
      }
    }

    .info-container {
      padding: 1rem;
      gap: 0.5rem;
    }

    .icons {
      .controls {
        display: flex;
        gap: 1rem;
      }

      svg {
        font-size: 2rem;
        cursor: pointer;
        transition: 0.3s ease-in-out;

        &:hover {
          color: #b8b8b8;
        }
      }
    }

    .genres {
      ul {
        display: flex;
        gap: 1rem;
        li {
          &:first-of-type {
            list-style-type: none;
          }
        }
      }
    }
  }
`;

const Feedback = styled.div`
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #e50914;
  color: white;
  padding: 0.3rem 0.8rem;
  font-size: 0.9rem;
  border-radius: 0.3rem;
  z-index: 100;
`;
