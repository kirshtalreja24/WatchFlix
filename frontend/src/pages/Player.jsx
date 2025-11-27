import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import axios from "axios";

export default function Player() {
  const navigate = useNavigate();
  const { movieId } = useParams(); // get movie id from URL
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/videos`,
          {
            params: {
              api_key: "f5fd5780bce0afc3ee345dc383adc165",
              language: "en-US",
            },
          }
        );

        const trailers = res.data.results.filter(
          (v) => v.site === "YouTube" && v.type === "Trailer"
        );

        if (trailers.length > 0) setTrailerKey(trailers[0].key);
      } catch (err) {
        console.error("Trailer fetch error:", err);
      }
    };

    fetchTrailer();
  }, [movieId]);

  return (
    <Container>
      <div className="player">
        <div className="back">
          <BsArrowLeft onClick={() => navigate(-1)} />
        </div>

        {trailerKey ? (
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${trailerKey}`}
            playing
            controls
            width="100%"
            height="100%"
          />
        ) : (
          <p className="no-trailer">Trailer not available</p>
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  .player {
    width: 100vw;
    height: 100vh;
    background-color: black;
    display: flex;
    justify-content: center;
    align-items: center;

    .back {
      position: absolute;
      padding: 2rem;
      z-index: 1;
      svg {
        font-size: 3rem;
        cursor: pointer;
        color: white;
      }
    }

    .no-trailer {
      color: white;
      font-size: 1.5rem;
    }
  }
`;
