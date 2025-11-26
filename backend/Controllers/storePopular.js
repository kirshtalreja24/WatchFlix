// run: node storePopularMovies.js
import axios from "axios";
// const axios = require("axios");
// const mysql = require("mysql2/promise");

import mysql from "mysql2/promise";

const Api_Key = "f5fd5780bce0afc3ee345dc383adc165";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "120329",
  database: "watchflix",
};

const getGenres = async () => {
  const { data } = await axios.get(
    `${TMDB_BASE_URL}/genre/movie/list?api_key=${Api_Key}`
  );
  return data.genres;
};

const createArrayFromRawData = (array, moviesArray, genres) => {
  array.forEach((movie) => {
    const movieGenres = [];

    movie.genre_ids.forEach((g) => {
      const found = genres.find((item) => item.id === g);
      if (found) movieGenres.push(found.name);
    });

    if (movie.backdrop_path) {
      moviesArray.push({
        id: movie.id,
        title: movie.title,
        image: movie.backdrop_path,
        genres: movieGenres.slice(0, 3).join(","), // CSV saved to DB
      });
    }
  });
};

const getRawData = async (api, genres) => {
  const movies = [];
  for (let i = 1; movies.length < 200 && i <= 10; i++) {
    const { data } = await axios.get(`${api}&page=${i}`);
    createArrayFromRawData(data.results, movies, genres);
  }
  return movies;
};

(async () => {
  const connection = await mysql.createConnection(dbConfig);
  console.log("Fetching popular movies...");

  const genres = await getGenres();
  const movies = await getRawData(
    `${TMDB_BASE_URL}/movie/popular?api_key=${Api_Key}`,
    genres
  );

  console.log(`Fetched ${movies.length} movies`);
  console.log("Inserting into database...");

  for (let movie of movies) {
    await connection.execute(
      `REPLACE INTO popular_movies (id, title, image, genres)
       VALUES (?, ?, ?, ?)`,
      [movie.id, movie.title, movie.image, movie.genres]
    );
  }

  console.log("Done! Popular movies stored.");
  connection.end();
})();
