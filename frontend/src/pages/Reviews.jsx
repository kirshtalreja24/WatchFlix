import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Reviews() {
  const { movieId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/reviews/${movieId}`)
      .then((res) => setReviews(res.data))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [movieId]);

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>Movie Reviews</h1>

      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        reviews.map((r) => (
          <div
            key={r.id}
            style={{
              marginBottom: "20px",
              background: "#222",
              padding: "20px",
              borderRadius: "10px"
            }}
          >
            <h3>{r.author}</h3>
            <p>{r.content}</p>
            <small>Rating: {r.rating ?? "N/A"}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default Reviews;
