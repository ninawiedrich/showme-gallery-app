import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import PublicGallery from './components/PublicGallery';
import { useAuth } from './useAuth';
import Header from './components/Header';

function App() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/gallery" element={<PublicGallery />} />
        {currentUser && <Route path="/profile" element={<Profile />} />}
        <Route path="/" element={currentUser ? <Profile /> : <SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;