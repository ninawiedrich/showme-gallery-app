import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth'; 
import logo from '../images/logo.png'; 
import './Header.css';

const Header = () => {
  const { currentUser, signOutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOutUser();
      navigate('/signin'); 
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <Navbar expand="lg" className="navbar">
      <Container>
        <Navbar.Brand href="/" className="navbar-brand d-flex align-items-center">
          <img
            src={logo}
            width="100"
            height="100"
            className="d-inline-block align-top"
            alt="Logo"
          />
          <span className="navbar-text">Photo Gallery</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {currentUser && (
              <>
                <Nav.Link href="/gallery" className="nav-link">Gallery</Nav.Link>
                <Nav.Link href="/profile" className="nav-link">Profile</Nav.Link>
              </>
            )}
            {currentUser && (
              <Button className="button-logout" onClick={handleLogout}>
                Log Out
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
