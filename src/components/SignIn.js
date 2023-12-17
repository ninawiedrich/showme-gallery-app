import React, { useState } from 'react';
import { Card, Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../useAuth';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
   const [isSignInHovered, setIsSignInHovered] = useState(false);
  const [isGoogleHovered, setIsGoogleHovered] = useState(false);

  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await signIn(email, password);
      navigate('/profile'); // Redirect to the profile page upon successful sign-in
    } catch (error) {
      console.error('SignIn Error:', error);
      setError('Failed to sign in');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Redirect logic here
    } catch (error) {
      setError('Failed to sign in with Google');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <Row className="w-100" style={{ maxWidth: "400px" }}>
        <Col>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Sign In</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Button
                className="w-100 mt-3"
                type="submit"
                onMouseEnter={() => setIsSignInHovered(true)}
                onMouseLeave={() => setIsSignInHovered(false)}
                style={{
                  backgroundColor: isSignInHovered ? 'white' : 'black',
                  color: isSignInHovered ? 'black' : 'white',
                  borderColor: 'black'
                }}
              >
                Sign In
              </Button>
              </Form>
              <Button
                className="w-100 mt-3"
                onMouseEnter={() => setIsGoogleHovered(true)}
                onMouseLeave={() => setIsGoogleHovered(false)}
                style={{
                  backgroundColor: isGoogleHovered ? '#4285F4' : 'white',
                  color: isGoogleHovered ? 'white' : '#4285F4',
                  borderColor: '#4285F4'
                }}
                onClick={handleGoogleSignIn}
              >
                Sign In with Google
              </Button>
              <div className="w-100 text-center mt-3" >
                Don't have an account? <Link to="/signup">Register here</Link>.
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;