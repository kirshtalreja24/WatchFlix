// run: node storePopularMovies.js
import axios from "axios";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "120329",
  database: "watchflix",
};

const Api_Key = "f5fd5780bce0afc3ee345dc383adc165";

const populateMovies = async () => {
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  try {
    // Create DB connection
    const db = await mysql.createConnection(dbConfig);

    // Fetch popular movies
    const response = await axios.get(
      "https://api.themoviedb.org/3/movie/popular",
      {
        params: {
          api_key: Api_Key,
          language: "en-US",
          page: 1,
        },
      }
    );

    const movies = response.data.results;

    // Insert into DB
    for (const m of movies) {
      try {
        const insertQuery = `
          INSERT INTO movies (title, description, poster, is_available)
          VALUES (?, ?, ?, TRUE)
        `;

        await db.query(insertQuery, [
          m.title,
          m.overview,
          m.poster_path ? IMAGE_BASE_URL + m.poster_path : null,
        ]);

        console.log(`Inserted movie: ${m.title}`);
      } catch (innerErr) {
        console.error(`Error inserting movie ${m.title}:`, innerErr);
      }
    }

    console.log("Movie population complete!");
    await db.end();
  } catch (err) {
    console.error("Error fetching movies from TMDB:", err);
  }
};

// Run instantly
populateMovies();
