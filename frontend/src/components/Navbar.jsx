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
    { name: "Rental", link: "/rental" }, // new reviews button
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
    transition: background-color 0.4s ease, padding 0.3s ease;

    &.scrolled {
      background-color: #000;
      padding: 0 3rem;
    }

    .left {
      display: flex;
      align-items: center;
      gap: 2rem;

      .brand img {
        height: 8rem;
        transition: transform 0.3s ease;
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
          position: relative;
          transition: color 0.3s ease;

          &:hover {
            color: #f34242;
          }

          &:after {
            content: "";
            position: absolute;
            width: 0%;
            height: 2px;
            bottom: -2px;
            left: 0;
            background-color: #f34242;
            transition: width 0.3s ease;
          }

          &:hover:after {
            width: 100%;
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
        padding: 0.5rem;
        border-radius: 6px;
        transition: background-color 0.3s ease, transform 0.2s ease;

        &:hover {
          background-color: rgba(243, 66, 66, 0.2);
          transform: scale(1.1);
        }
      }

      .auth-btn {
        color: white;
        text-decoration: none;
        padding: 0.4rem 0.8rem;
        border: 1px solid white;
        border-radius: 4px;
        transition: all 0.3s ease;

        &:hover {
          background-color: white;
          color: black;
          transform: scale(1.05);
        }
      }
    }
  }

  @media (max-width: 768px) {
    nav {
      padding: 0 2rem;

      .left {
        gap: 1rem;

        .brand img {
          height: 6rem;
        }

        .links {
          gap: 1rem;
          li a {
            font-size: 0.9rem;
          }
        }
      }

      .right {
        gap: 0.5rem;

        .auth-btn {
          padding: 0.3rem 0.6rem;
          font-size: 0.9rem;
        }
      }
    }
  }
`;

