import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import BackgroundImage from "../components/Backgroundimage";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

export default function Signup() {

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    const { email, password } = formValues;
    if (!email || !password) {
      setMessage("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/signup", {
        email,
        password,
      });

      setMessage(res.data.message);
      setLoading(false);

      // Redirect to login after successful signup
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
      setLoading(false);
    }
  };

  return (
    <Container showPassword={showPassword}>
      <BackgroundImage />
      <div className="content">
        <Header login />
        <div className="body flex column a-center j-center">
          <div className="text flex column">
            <h1>Unlimited movies, TV shows and more.</h1>
            <h4>Watch anywhere. Cancel anytime.</h4>
            <h6>Ready to watch? Enter your email to create an account.</h6>
          </div>

          <div className="form">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={formValues.email}
              onChange={(e) =>
                setFormValues({ ...formValues, [e.target.name]: e.target.value })
              }
            />

            {showPassword && (
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formValues.password}
                onChange={(e) =>
                  setFormValues({ ...formValues, [e.target.name]: e.target.value })
                }
              />
            )}

            {!showPassword && (
              <button onClick={() => setShowPassword(true)}>Get Started</button>
            )}
            
          {showPassword && (
            <button onClick={handleSignUp} disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          )}
          
          </div>


          {message && <p style={{ color: "white", marginTop: "1rem" }}>{message}</p>}
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  .content {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    height: 100vh;
    width: 100vw;
    display: grid;
    grid-template-rows: 15vh 85vh;

    .body {
      gap: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .text {
        gap: 1rem;
        text-align: center;
        font-size: 2rem;

        h1 {
          padding: 0 25rem;
        }
      }

      .form {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        width: 50%;

        input {
          color: black;
          border: 1px solid black;
          padding: 1rem;
          font-size: 1rem;
          border-radius: 0.2rem;

          &:focus {
            outline: none;
          }
        }

        button {
          padding: 0.75rem 1rem;
          background-color: #e50914;
          border: none;
          cursor: pointer;
          color: white;
          font-weight: bolder;
          font-size: 1rem;
          border-radius: 0.2rem;

          &:disabled {
            background-color: #8a8a8a;
            cursor: not-allowed;
          }
        }
      }

      p {
        margin-top: 1rem;
      }
    }
  }
`;
