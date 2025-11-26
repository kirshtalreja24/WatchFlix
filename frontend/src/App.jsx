import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Netflix from "./pages/Netflix";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Player from "./pages/Player";
import ProtectedRoute from "./components/ProtectedRoute";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import UserListedMovies from "./pages/UserListedMovies";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Netflix />
            </ProtectedRoute>
          }
        />

        <Route
          path="/movies"
          element={
            <ProtectedRoute>
              <Movies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tv"
          element={
            <ProtectedRoute>
              <TVShows />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mylist"
          element={
            <ProtectedRoute>
              <UserListedMovies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/player"
          element={
            <ProtectedRoute>
              <Player />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
