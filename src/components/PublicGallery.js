import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import { db } from '../firebase-config';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';

const PublicGallery = () => {
    const [sharedPhotos, setSharedPhotos] = useState([]);
    const [usernames, setUsernames] = useState({});
    const [filterCategory, setFilterCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterUsername, setFilterUsername] = useState('');
    const [showBioModal, setShowBioModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const photosRef = collection(db, 'photos');
        const q = query(photosRef, where("shared", "==", true));
        onSnapshot(q, async (querySnapshot) => {
            let photos = [];
            let userIds = new Set();
            querySnapshot.forEach((doc) => {
                photos.push({ id: doc.id, ...doc.data() });
                userIds.add(doc.data().userId);
            });
            setSharedPhotos(photos);

            // Fetch user data for displayed photos
            let userMap = {};
            for (let userId of userIds) {
                const userDocRef = doc(db, 'users', userId);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    userMap[userId] = userDocSnap.data().username;
                }
            }
            setUsernames(userMap);
        });
    }, []);

    const handleUserNameClick = async (userId) => {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            setSelectedUser(userDocSnap.data());
            setShowBioModal(true);
        }
    };

    const filteredPhotos = sharedPhotos.filter(photo => {
        return (filterCategory ? photo.category === filterCategory : true) &&
               (searchTerm ? photo.tag.toLowerCase().includes(searchTerm.toLowerCase()) : true) &&
               (filterUsername ? usernames[photo.userId]?.toLowerCase().includes(filterUsername.toLowerCase()) : true);
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
                <Col>
                    <Form.Control
                        type="text"
                        placeholder="Search by username"
                        value={filterUsername}
                        onChange={(e) => setFilterUsername(e.target.value)}
                    />
                </Col>
            </Row>
            <Row xs={1} md={3} className="g-4">
                {filteredPhotos.map((photo) => (
                    <Col key={photo.id}>
                        <Card>
                            <Card.Img variant="top" src={photo.url} />
                            <Card.Body>
                                <Card.Title>{photo.tag}</Card.Title>
                                <p>Uploaded by: <Button variant="link" onClick={() => handleUserNameClick(photo.userId)}>{usernames[photo.userId]}</Button></p>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Modal show={showBioModal} onHide={() => setShowBioModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>User Bio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser ? (
                        <>
                            <h4>{selectedUser.username}</h4>
                            <p>{selectedUser.bio}</p>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default PublicGallery;
