import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../useAuth';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
    <div className="signup-container">
      <Card className="signup-card">
        <Card.Body>
          <h2 className="signup-title">Sign Up for Photo Gallery</h2>
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
            <Button className="w-100 mt-3" type="submit">
              Sign Up
            </Button>
          </Form>
          <div className="mt-3">
            Already have an account? <Link to="/signin">Sign In here</Link>.
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SignUp;
