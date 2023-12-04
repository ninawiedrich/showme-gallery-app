import React, { useState, useEffect } from 'react';
import { Container, Modal, Form, Row, Col } from 'react-bootstrap';
import { db } from '../firebase-config';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './PublicGallery.css';

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
          console.log("Fetched User Data:", userDocSnap.data());
            setSelectedUser(userDocSnap.data());
            setShowBioModal(true);
        }
    };

    const applyFilters = photo => {
        const matchesCategory = filterCategory ? photo.category === filterCategory : true;
        const matchesTag = searchTerm ? photo.tag.toLowerCase().includes(searchTerm.toLowerCase()) : true;
        const matchesUsername = filterUsername ? usernames[photo.userId]?.toLowerCase().includes(filterUsername.toLowerCase()) : true;
        return matchesCategory && matchesTag && matchesUsername;
    };

    const filteredPhotos = sharedPhotos.filter(applyFilters);

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 3 
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1 
        }
    };

    return (
        <Container>
            <div className="gallery-header">
                <h1>Public Gallery</h1>
            </div>
            <Row className="gallery-filter-row">
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
                        <option value="Technology">Technology</option>
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
            <div className="gallery-container">
                <Carousel
                    swipeable={true}
                    draggable={true}
                    showDots={true}
                    responsive={responsive}
                    ssr={true}
                    infinite={true}
                    autoPlay={false}
                    keyBoardControl={true}
                    customTransition="all .5s"
                    transitionDuration={500}
                    containerClass="carousel-container"
                    removeArrowOnDeviceType={["tablet", "mobile"]}
                    itemClass="carousel-item-padding-40-px"
                >
                    {filteredPhotos.map((photo) => (
                        <div key={photo.id} style={{ textAlign: 'center', height: '50vh' }}>
                            <img
                                src={photo.url}
                                alt={photo.tag}
                                className="photo-frame"
                            />
                            <div className="photo-details">
                                <h5>{photo.tag}</h5>
                                <p onClick={() => handleUserNameClick(photo.userId)}>
                                    Uploaded by: {usernames[photo.userId] || 'Unknown'}
                                </p>
                            </div>
                        </div>
                    ))}
                </Carousel>
            </div>
            <Modal style={{ color: '#000', textAlign: 'center' }} show={showBioModal} onHide={() => setShowBioModal(false)}>
            <Modal.Header closeButton>
  <div style={{ width: '100%', textAlign: 'center' }}>
    {selectedUser && <Modal.Title>{selectedUser.username}</Modal.Title>}
  </div>
</Modal.Header>

    <Modal.Body>
        {selectedUser ? (
            <>
                {selectedUser.avatar && (
                    <img 
                        src={selectedUser.avatar} 
                        alt="Avatar" 
                        style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }} 
                    />
                )}
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