import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth'; // Adjust the path as necessary
import logo from '../images/logo.png'; // Adjust the path to your logo

const Header = () => {
  const { currentUser, signOutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOutUser();
      navigate('/signin'); // Redirect to the sign-in page
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <img
            src={logo}
            width="65"
            height="65"
            className="d-inline-block align-top"
            alt="Photo Gallery Logo"
          />
          {' '}Photo Gallery
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Conditionally render links if user is logged in */}
            {currentUser && (
              <>
                <Nav.Link href="/gallery">Gallery</Nav.Link>
                <Nav.Link href="/profile">Profile</Nav.Link>
              </>
            )}
          </Nav>
          {currentUser && (
            <Button variant="outline-danger" onClick={handleLogout}>
              Log Out
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
