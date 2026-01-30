import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Movie from './Pages/Movie';
import Release from './Pages/Release';
import Booking from './Pages/Booking';
import ContactUs from './Pages/ContactUs';
import MovieDetailePage from './Pages/MovieDetailePage';
import MovieDetailePageHome from './Pages/MovieDetailePageHome';
import SeatSelector from './Pages/SeatSelector';
import SeatSelectorPageHome from './Components/SeatSelectorPageHome';


function App() {

  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movie />} />
        <Route path='/releases' element={<Release />} />
        <Route path='/Bookings' element={<Booking />} />
        <Route path='/contact' element={<ContactUs />} />
        <Route path='/movies/:id' element={<MovieDetailePage />} />
        <Route path='/movie/:id' element={<MovieDetailePageHome />} />
        <Route path='/movies/:id/seat/:slot' element={<SeatSelector />} />
        <Route path='/movies/:id/seat-selector/:slot' element={<SeatSelector />} />
        <Route path='/movie/:id/seat/:slot' element={<SeatSelectorPageHome />} />
        <Route path='/movie/:id/seat-selector/:slot' element={<SeatSelectorPageHome />} />



        <Route
          path='/Login'
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />

        <Route
          path='/SignUp'
          element={isAuthenticated ? <Navigate to="/" replace /> : <SignUp />}
        />

        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;