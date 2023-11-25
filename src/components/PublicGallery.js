// PublicGallery.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import { db } from '../firebase-config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const PublicGallery = () => {
    const [sharedPhotos, setSharedPhotos] = useState([]);
    const [filterCategory, setFilterCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const photosRef = collection(db, 'photos');
        const q = query(photosRef, where("shared", "==", true));
        onSnapshot(q, (querySnapshot) => {
            setSharedPhotos(querySnapshot.docs.map(doc => doc.data()));
        });
    }, []);

    const filteredPhotos = sharedPhotos.filter(photo => {
        return (filterCategory ? photo.category === filterCategory : true) &&
               (searchTerm ? photo.tag.toLowerCase().includes(searchTerm.toLowerCase()) : true);
    });

    return (
        <Container>
            <h1>Public Gallery</h1>
            <Row className="mb-4">
                <Col>
                    <Form.Control
                        as="select"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="Nature">Nature</option>
                        <option value="Animals">Animals</option>
                        <option value="People">People</option>
                        {/* Add more categories as needed */}
                    </Form.Control>
                </Col>
                <Col>
                    <Form.Control
                        type="text"
                        placeholder="Search by tag"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
            </Row>
            <Row xs={1} md={3} className="g-4">
                {filteredPhotos.map((photo, index) => (
                    <Col key={index}>
                        <Card>
                            <Card.Img variant="top" src={photo.url} />
                            <Card.Body>
                                <Card.Title>{photo.tag}</Card.Title>
                                {/* Additional photo details can be added here if needed */}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default PublicGallery;
