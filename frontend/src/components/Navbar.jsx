import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo.png";
import { FaPowerOff } from "react-icons/fa";
import axios from "axios";

export default function Navbar({ isScrolled }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on mount
  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const links = [
    { name: "Home", link: "/home" },
    { name: "TV Shows", link: "/tv" },
    { name: "Movies", link: "/movies" },
    { name: "My List", link: "/mylist" },
    { name: "Popular", link: "/popular" },
    { name: "Payment", link: "/payment" },
    { name: "Top Rated", link: "/toprated" },
    { name: "Reviews", link: "/reviews" }, // new reviews button
  ];

  const handleSignOut = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Container>
      <nav className={isScrolled ? "scrolled" : ""}>
        <div className="left">
          <div className="brand">
            <img src={logo} alt="Logo" />
          </div>

          {isLoggedIn && (
            <ul className="links">
              {links.map(({ name, link }) => (
                <li key={name}>
                  <Link to={link}>{name}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="right">
          {isLoggedIn ? (
            <button onClick={handleSignOut}>
              <FaPowerOff />
            </button>
          ) : (
            <>
              <Link to="/login" className="auth-btn">
                Login
              </Link>
              <Link to="/signup" className="auth-btn">
                Signup
              </Link>
            </>
          )}
        </div>
      </nav>
    </Container>
  );
}

const Container = styled.div`
  nav {
    position: fixed;
    top: 0;
    width: 100%;
    height: 6.5rem;
    background-color: rgba(0, 0, 0, 0.85);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 4rem;
    z-index: 1000;
    transition: 0.3s ease-in-out;

    &.scrolled {
      background-color: black;
    }

    .left {
      display: flex;
      align-items: center;
      gap: 2rem;

      .brand img {
        height: 4rem;
      }

      .links {
        list-style: none;
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin: 0;
        padding: 0;

        li a {
          color: white;
          text-decoration: none;
          font-size: 1rem;
          padding: 0.2rem 0.5rem;
          &:hover {
            color: #f34242;
          }
        }
      }
    }

    .right {
      display: flex;
      align-items: center;
      gap: 1rem;

      button {
        background: none;
        border: none;
        cursor: pointer;
        color: #f34242;
        font-size: 1.2rem;
      }

      .auth-btn {
        color: white;
        text-decoration: none;
        padding: 0.4rem 0.8rem;
        border: 1px solid white;
        border-radius: 4px;
        transition: 0.2s;
        &:hover {
          background-color: white;
          color: black;
        }
      }
    }
  }
`;
