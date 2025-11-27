import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import styled from "styled-components";

export default function Subscription() {
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState(null);
  const [userPlan, setUserPlan] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    axios
      .get("http://localhost:5000/plans")
      .then((res) => setPlans(res.data))
      .catch((err) => console.error(err));

    const loggedUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedUser);

    if (loggedUser) {
      axios
        .get(`http://localhost:5000/user-subscription/${loggedUser.id}`)
        .then((res) => setUserPlan(res.data.plan))
        .catch((err) => console.error(err));
    }
  }, []);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000); // auto-hide
  };

  const handleSubscribe = (plan) => {
    if (!user) return showMessage("Please login to subscribe!", "error");

    axios
      .post("http://localhost:5000/subscribe", {
        userId: user.id,
        plan: plan.plan,
        price: plan.price,
        benefits: plan.benefits,
      })
      .then((res) => {
        showMessage(res.data.message, "success");
        setUserPlan(plan.plan);
      })
      .catch((err) => {
        console.error(err);
        showMessage("Subscription failed!", "error");
      });
  };

  return (
    <Container>
      <Navbar />

      {/* ============ UI MESSAGE ============= */}
      {message.text && (
        <Message type={message.type}>{message.text}</Message>
      )}

      <h1 className="title">Choose Your Plan</h1>
      <div className="plans">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`card ${userPlan === plan.plan ? "subscribed" : ""}`}
          >
            <h2>{plan.plan}</h2>
            <p className="price">${plan.price}/mo</p>
            <ul>
              {plan.benefits.map((b, i) => (
                <li key={i}>✔ {b}</li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan)}
              disabled={userPlan === plan.plan}
            >
              {userPlan === plan.plan
                ? `Subscribed to ${plan.plan}`
                : "Subscribe"}
            </button>
          </div>
        ))}
      </div>
    </Container>
  );
}

const Message = styled.div`
  width: 100%;
  text-align: center;
  padding: 1rem;
  margin-bottom: 1rem;
  font-weight: bold;
  border-radius: 8px;
  animation: fadeIn 0.4s ease-in-out;
  color: white;

  background-color: ${({ type }) =>
    type === "success" ? "#28a745" : "#e63946"};

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Container = styled.div`
  padding: 8rem 4rem 2rem 4rem;
  color: white;
  min-height: 100vh;
  background: linear-gradient(180deg, #141414 0%, #1c1c1c 100%);

  .title {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    font-weight: bold;
  }

  .plans {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;

    .card {
      background-color: #222;
      border-radius: 12px;
      padding: 2rem;
      width: 250px;
      text-align: center;
      border: 2px solid transparent;
      transition: 0.3s;

      &.subscribed {
        border-color: #f34242;
        background-color: #333;
      }

      h2 {
        margin-bottom: 1rem;
      }

      .price {
        font-size: 1.5rem;
        margin-bottom: 1rem;
      }

      ul {
        text-align: left;
        margin-bottom: 1rem;

        li {
          margin: 0.3rem 0;
        }
      }

      button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        background-color: #f34242;
        color: white;
        font-weight: bold;
        transition: 0.2s;

        &:hover:enabled {
          background-color: #ff5959;
        }

        &:disabled {
          background-color: #777;
          cursor: not-allowed;
        }
      }
    }
  }
`;
