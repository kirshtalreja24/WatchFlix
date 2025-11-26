const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const session = require("express-session");
const methodOverride = require("method-override");

const app = express();
const port = 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true, 
}));

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  name :"krs",
  secret: "your_secret_key",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // true if using https
}));

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "120329",
  database: "watchflix",
  port: 3306,
});

db.connect(err => {
  if (err) {
    console.error("DB connection error:", err);
    return;
  }
  console.log("Connected to MySQL database");
});


// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "All fields required" });

  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    if (result.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    // Save user info in session
    req.session.user = { id: result[0].id, email: result[0].email };
    res.json({ message: "Login successful", user: req.session.user });
    console.log("Session after login:", req.session);

  });
});

// Signup route
app.post("/signup", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "All fields required" });

  const query = "INSERT INTO users (email, password) VALUES (?, ?)";
  db.query(query, [email, password], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") return res.status(400).json({ message: "Email exists" });
      return res.status(500).json({ message: "DB error", error: err });
    }
    res.json({ message: "User registered successfully" });
  });
});




// Logout route
app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid"); // clear session cookie
    res.json({ message: "Logged out successfully" });
  });
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));



// Add a movie to liked list
app.post("/liked-movies", (req, res) => {
  const { email, movie } = req.body;

  const getUserQuery = "SELECT id FROM users WHERE email = ?";
  db.query(getUserQuery, [email], (err, users) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    if (users.length === 0) return res.status(404).json({ message: "User not found" });

    const userId = users[0].id;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const formattedMovie = {
  id: movie.id,
  name: movie.original_title || movie.title || movie.name,
  image: movie.image
          ? movie.image
          : movie.backdrop_path
            ? IMAGE_BASE_URL + movie.backdrop_path
            : movie.poster_path
              ? IMAGE_BASE_URL + movie.poster_path
              : "", 
  genres: movie.genres || movie.genre_ids || [],
};

console.log("Formatted movie to insert:", formattedMovie);

    const insertQuery = `
      INSERT INTO liked_movies (user_id, movie_id, movie_data)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE movie_data = VALUES(movie_data)
    `;

    db.query(
      insertQuery,
      [userId, formattedMovie.id, JSON.stringify(formattedMovie)],
      (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });
        res.json({ message: "Movie added to liked list" });
      }
    );
  });
});





app.get("/liked-movies/:email", (req, res) => {
  const { email } = req.params;
  console.log("Fetching liked movies for email:", email);
  
  const getUserQuery = "SELECT id FROM users WHERE email = ?";
  db.query(getUserQuery, [email], (err, users) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    if (users.length === 0) return res.status(404).json({ message: "User not found" });

    const userId = users[0].id;

    const getLikedMoviesQuery = "SELECT movie_data FROM liked_movies WHERE user_id = ?";
    db.query(getLikedMoviesQuery, [userId], (err, results) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });

      // No JSON.parse needed if stored as JSON object
      const movies = results
        .map(row => row.movie_data)
        .filter(Boolean);

      console.log("Parsed liked movies:", movies);
      res.json(movies);
    });
  });
});


app.delete("/liked-movies", (req, res) => {
  const { email, movieId } = req.body;

  const getUserQuery = "SELECT id FROM users WHERE email = ?";
  db.query(getUserQuery, [email], (err, users) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    if (users.length === 0) return res.status(404).json({ message: "User not found" });

    const userId = users[0].id;

    const deleteQuery = "DELETE FROM liked_movies WHERE user_id = ? AND movie_id = ?";
    db.query(deleteQuery, [userId, movieId], (err) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });

      // After delete -> return updated liked movies
      const getMoviesQuery = "SELECT movie_data FROM liked_movies WHERE user_id = ?";
      db.query(getMoviesQuery, [userId], (err, movies) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });

        // Safely parse movie_data
        const likedMovies = movies
          .map(row => {
            try {
              return JSON.parse(row.movie_data);
            } catch (e) {
              return null;
            }
          })
          .filter(Boolean);

        res.json({ message: "Movie removed from liked list", movies: likedMovies });
      });
    });
  });
});



app.get("/popular-movies", (req, res) => {
  const query = "SELECT * FROM popular_movies";
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "DB error", err });

    const formatted = results.map((movie) => ({
      ...movie,
      genres: movie.genres
        ? movie.genres.split(",").map((g) => g.trim())
        : [],
    }));

    res.json(formatted);
  });
});




app.get("/plans", (req, res) => {
  const plans = [
    {
      plan: "Standard",
      price: 9.99,
      benefits: ["HD streaming", "1 device", "basic support"],
    },
    {
      plan: "Premium",
      price: 14.99,
      benefits: ["Full HD", "2 devices", "priority support"],
    },
    {
      plan: "VIP",
      price: 19.99,
      benefits: ["Ultra HD", "4 devices", "premium support"],
    },
  ];
  res.json(plans);
});



// Subscribe route
app.post("/subscribe", (req, res) => {
  const { userId, plan, price, benefits } = req.body;
  if (!userId || !plan || !price || !benefits)
    return res.status(400).json({ message: "All fields are required" });

  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1); // 1-month subscription

  const insertQuery = `
    INSERT INTO subscriptions (user_id, plan, price, benefits, start_date, end_date)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE plan = VALUES(plan), price = VALUES(price), benefits = VALUES(benefits), start_date = VALUES(start_date), end_date = VALUES(end_date)
  `;

  db.query(
    insertQuery,
    [userId, plan, price, JSON.stringify(benefits), startDate, endDate],
    (err, result) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });
      res.json({ message: "Subscription updated successfully" });
    }
  );
});

// Fetch user's current subscription
app.get("/subscription/:userId", (req, res) => {
  const { userId } = req.params;

  const query = "SELECT * FROM subscriptions WHERE user_id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    if (results.length === 0) return res.json(null);
    const subscription = results[0];
    subscription.benefits = JSON.parse(subscription.benefits);
    res.json(subscription);
  });
});




