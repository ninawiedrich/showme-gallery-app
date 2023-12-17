import React, { useState } from 'react';
import { Card, Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await signUp(email, password);
      navigate('/'); // Redirect to home page or profile page upon successful signup
    } catch (error) {
      console.error('SignUp Error:', error);
      setError('Failed to sign up');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <Row className="w-100" style={{ maxWidth: "400px" }}>
        <Col>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Sign Up for Photo Gallery</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Button
                  className="w-100 mt-3"
                  type="submit"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={{
                    backgroundColor: isHovered ? 'white' : 'black',
                    color: isHovered ? 'black' : 'white',
                    borderColor: 'black'
                  }}
                >
                  Sign Up
                </Button>
              </Form>
              <div className="w-100 text-center mt-3">
                Already have an account? <Link to="/signin" className="link">Sign In here</Link>.
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;
