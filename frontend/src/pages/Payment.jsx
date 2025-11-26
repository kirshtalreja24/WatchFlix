import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

export default function SubscriptionPage() {
  const [plans, setPlans] = useState([]);
  const [userPlan, setUserPlan] = useState(null); // current user's subscription

  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    const fetchPlans = async () => {
      const res = await axios.get("http://localhost:5000/plans");
      setPlans(res.data);
    };
    const fetchUserPlan = async () => {
      const res = await axios.get(`http://localhost:5000/subscription/${userId}`);
      setUserPlan(res.data?.plan || null);
    };

    fetchPlans();
    fetchUserPlan();
  }, [userId]);

  const handleSubscribe = async (plan) => {
    const selectedPlan = plans.find(p => p.plan === plan);
    if (!selectedPlan) return;

    await axios.post("http://localhost:5000/subscribe", {
      userId,
      plan: selectedPlan.plan,
      price: selectedPlan.price,
      benefits: selectedPlan.benefits
    });

    setUserPlan(plan); // update current subscription
  };

  return (
    <Container>
      <h1 className="title">Choose your plan</h1>
      <div className="plans">
        {plans.map((p) => (
          <div key={p.plan} className={`card ${userPlan === p.plan ? "subscribed" : ""}`}>
            <h2>{p.plan}</h2>
            <p className="price">${p.price}</p>
            <ul>
              {p.benefits.map((b, idx) => <li key={idx}>{b}</li>)}
            </ul>
            <button
              onClick={() => handleSubscribe(p.plan)}
              disabled={userPlan === p.plan}
            >
              {userPlan === p.plan ? `Subscribed to ${p.plan}` : "Subscribe"}
            </button>
          </div>
        ))}
      </div>
    </Container>
  );
}

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
