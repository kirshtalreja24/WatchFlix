import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import styled, { keyframes } from "styled-components";

export default function Rentals() {
  const [movies, setMovies] = useState([]);
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState(null); // for modern UI messages
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios.get("http://localhost:5000/rental/movies")
      .then(res => setMovies(res.data));

    axios.get(`http://localhost:5000/rental/history/${user.id}`)
      .then(res => setHistory(res.data));
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000); // disappear after 3s
  };

  const rentMovie = async (movieId) => {
    try {
      await axios.post("http://localhost:5000/rental/rent", {
        userId: user.id,
        movieId
      });
      showToast("Movie rented successfully!");
      // Refresh movies and history
      const moviesRes = await axios.get("http://localhost:5000/rental/movies");
      setMovies(moviesRes.data);
      const historyRes = await axios.get(`http://localhost:5000/rental/history/${user.id}`);
      setHistory(historyRes.data);
    } catch (err) {
      showToast("Failed to rent movie.", "error");
    }
  };

  const returnMovie = async (rentalId) => {
    try {
      await axios.post("http://localhost:5000/rental/return", { rentalId });
      showToast("Movie returned successfully!");
      const historyRes = await axios.get(`http://localhost:5000/rental/history/${user.id}`);
      setHistory(historyRes.data);
    } catch (err) {
      showToast("Failed to return movie.", "error");
    }
  };

  return (
    <Container>
      <Navbar />
      {toast && <Toast type={toast.type}>{toast.message}</Toast>}

      <h1>Available Movies to Rent</h1>
      <div className="grid">
        {movies.map(m => (
          <div key={m.id} className="card">
            <img src={m.poster} alt="" />
            <h3>{m.title}</h3>
            <button onClick={() => rentMovie(m.id)}>Rent</button>
          </div>
        ))}
      </div>

      <h1>Your Rental History</h1>
      <div className="history">
        {history.map(h => (
          <div key={h.id} className="row">
            <img src={h.poster} alt="" />
            <div>
              <h3>{h.title}</h3>
              <p>Rented: {new Date(h.rented_at).toLocaleString()}</p>
              {h.return_date ? (
                <p>Returned: {new Date(h.return_date).toLocaleString()}</p>
              ) : (
                <button onClick={() => returnMovie(h.id)}>Return</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}

// Styled Components
const fadeInOut = keyframes`
  0% {opacity: 0; transform: translateY(-20px);}
  10% {opacity: 1; transform: translateY(0);}
  90% {opacity: 1; transform: translateY(0);}
  100% {opacity: 0; transform: translateY(-20px);}
`;

const Toast = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ type }) => type === "error" ? "#ff4d4f" : "#4caf50"};
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  z-index: 9999;
  animation: ${fadeInOut} 3s ease forwards;
`;

const Container = styled.div`
  padding: 6rem 3rem;
  color: white;
  background: #121212;
  min-height: 100vh;

  h1 {
    margin-bottom: 2rem;
    font-size: 2rem;
    font-weight: bold;
    border-bottom: 2px solid #f34242;
    padding-bottom: 0.5rem;
  }

  .grid {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .card {
    background: #1f1f1f;
    padding: 1rem;
    width: 200px;
    border-radius: 12px;
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    }

    img {
      width: 100%;
      border-radius: 12px;
      margin-bottom: 0.8rem;
    }

    h3 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    button {
      margin-top: 0.5rem;
      background: #f34242;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      color: white;
      font-weight: 500;
      transition: background 0.2s;

      &:hover {
        background: #ff5959;
      }
    }
  }

  .history {
    margin-top: 3rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .row {
      display: flex;
      background: #1f1f1f;
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
      }

      img {
        width: 100px;
        object-fit: cover;
      }

      div {
        padding: 0.8rem 1rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;

        h3 {
          font-size: 1.1rem;
          margin-bottom: 0.3rem;
          font-weight: 600;
        }

        p {
          font-size: 0.9rem;
          color: #ccc;
          margin: 2px 0;
        }

        button {
          margin-top: 0.5rem;
          align-self: flex-start;
          background: #f34242;
          padding: 0.4rem 0.8rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          color: white;
          font-weight: 500;
          transition: background 0.2s;

          &:hover {
            background: #ff5959;
          }
        }
      }
    }
  }

  @media (max-width: 768px) {
    .grid {
      justify-content: center;
    }

    .history .row {
      flex-direction: column;
      align-items: center;

      div {
        align-items: center;
        text-align: center;
      }

      img {
        margin-bottom: 0.5rem;
      }
    }
  }
`;
