// PublicGallery.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { db } from '../firebase-config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const PublicGallery = () => {
  const [sharedPhotos, setSharedPhotos] = useState([]);

  useEffect(() => {
    const photosRef = collection(db, 'photos');
    const q = query(photosRef, where("shared", "==", true));
    onSnapshot(q, (querySnapshot) => {
      setSharedPhotos(querySnapshot.docs.map(doc => doc.data()));
    });
  }, []);

  return (
    <Container>
      <h1>Public Gallery</h1>
      <Row xs={1} md={3} className="g-4 mt-3">
        {sharedPhotos.map((photo, index) => (
          <Col key={index}>
            <Card>
              <Card.Img variant="top" src={photo.url} />
              <Card.Body>
                <Card.Title>{photo.tag}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PublicGallery;
