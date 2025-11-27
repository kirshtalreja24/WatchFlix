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
import Popular from "./pages/Popular";
import Payment from "./pages/Payment";
import TopRated from "./pages/Toprated";
import Reviews from "./pages/Reviews";
import ReviewsPage from "./pages/ReviewsPage";
import Rentals from "./pages/Rentals";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

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
          <Route path="/reviews" element={<ReviewsPage />} />

        <Route path="/player/:movieId" element={<Player />} />


        <Route
          path="/popular"
          element={
            <ProtectedRoute>
              <Popular />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviews/:movieId"
          element={
            <ProtectedRoute>
             <Reviews />
          </ProtectedRoute>
          }
          />

        
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment /> 
            </ProtectedRoute>
          }
        />
        <Route
         path="/toprated"
         element={
           <ProtectedRoute>
            <TopRated />
         </ProtectedRoute>
          }
        />

         <Route
         path="/rental"
         element={
           <ProtectedRoute>
            <Rentals />
         </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
