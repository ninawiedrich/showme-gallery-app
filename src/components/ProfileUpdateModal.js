// ProfileUpdateModal.js
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ProfileUpdateModal = ({ show, handleClose, bio, handleBioUpdate }) => {
  const [localBio, setLocalBio] = useState(bio);

  const onSubmit = () => {
    handleBioUpdate(localBio);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="bio">
            <Form.Label>Bio</Form.Label>
            <Form.Control as="textarea" rows={3} value={localBio} onChange={(e) => setLocalBio(e.target.value)} />
          </Form.Group>
          {/* Add more form fields here if needed */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={onSubmit}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProfileUpdateModal;
