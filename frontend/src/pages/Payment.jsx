import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import styled from "styled-components";

export default function Subscription() {
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/plans")
      .then(res => setPlans(res.data))
      .catch(err => console.error(err));

    const loggedUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedUser);
  }, []);

  const handleSubscribe = (plan) => {
    if (!user) return alert("Please login to subscribe!");

    axios.post("http://localhost:5000/subscribe", {
      userId: user.id,
      plan: plan.plan,
      price: plan.price,
      benefits: plan.benefits
    })
    .then(res => alert(res.data.message))
    .catch(err => {
      console.error(err);
      alert("Subscription failed!");
    });
  };

  return (
    <Container>
      <Navbar />
      <h1 className="title">Choose Your Plan</h1>
      <div className="plans">
        {plans.map((plan, idx) => (
          <div key={idx} className="card">
            <div className="card-header">
              <h2>{plan.plan}</h2>
              <p className="price">${plan.price}/mo</p>
            </div>
            <ul className="benefits">
              {plan.benefits.map((b, i) => <li key={i}>✔ {b}</li>)}
            </ul>
            <button onClick={() => handleSubscribe(plan)}>Subscribe</button>
          </div>
        ))}
      </div>
    </Container>
  );
}

const Container = styled.div`
  color: white;
  padding: 8rem 4rem 2rem 4rem;
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
  }

  .card {
    background-color: #222;
    border-radius: 12px;
    width: 280px;
    padding: 2rem 1.5rem;
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;
    border: 2px solid transparent;

    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.6);
      border-color: #f34242;
    }

    .card-header {
      margin-bottom: 1.5rem;
      h2 {
        font-size: 1.8rem;
        margin-bottom: 0.5rem;
      }
      .price {
        font-size: 1.2rem;
        color: #f34242;
      }
    }

    .benefits {
      list-style: none;
      padding: 0;
      margin: 0 0 1.5rem 0;
      li {
        margin: 0.5rem 0;
        font-size: 1rem;
        color: #ddd;
      }
    }

    button {
      background-color: #f34242;
      border: none;
      padding: 0.7rem 1.5rem;
      border-radius: 6px;
      font-size: 1rem;
      cursor: pointer;
      color: white;
      transition: background-color 0.3s;

      &:hover {
        background-color: #ff5a5a;
      }
    }
  }

  @media (max-width: 900px) {
    padding: 2rem;
    .plans {
      gap: 1.5rem;
    }
    .card {
      width: 100%;
      max-width: 350px;
    }
  }
`;