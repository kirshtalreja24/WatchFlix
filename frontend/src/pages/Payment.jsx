import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import styled from "styled-components";
import axios from "axios";

export default function Payment() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await axios.get(
            "http://localhost:5000/get-payment",
             { withCredentials: true}
        );
        setSubscription(res.data);
      } catch (err) {
        console.error(err);
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  return (
    <Container>
      <Navbar isScrolled={false} />
      <div className="content">
        <h1>Payment & Subscription</h1>

        {loading ? (
          <p>Loading...</p>
        ) : !subscription ? (
          <p>Please log in to see your subscription.</p>
        ) : (
          <div className="subscription-card">
            <h2>{subscription.plan} Plan</h2>
            <p className="price">${subscription.price} / month</p>
            <p>
              Valid from {subscription.start_date} to {subscription.end_date}
            </p>
            <ul>
              {subscription.benefits.map((b, idx) => (
                <li key={idx}>{b}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  color: white;
  min-height: 100vh;
  background-color: #141414;

  .content {
    margin-top: 7rem;
    margin-left: 4rem;

    h1 {
      margin-bottom: 2rem;
    }

    .subscription-card {
      background-color: #1f1f1f;
      padding: 2rem;
      border-radius: 10px;
      max-width: 400px;

      h2 {
        font-size: 1.8rem;
        margin-bottom: 0.5rem;
      }

      .price {
        font-size: 1.3rem;
        margin-bottom: 1rem;
        color: #e50914;
      }

      ul {
        list-style-type: disc;
        padding-left: 1.5rem;
        li {
          margin-bottom: 0.5rem;
        }
      }
    }
  }
`;
