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
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

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

    const handleUserNameClick = async (userId, e) => {
      e.stopPropagation();

        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            setSelectedUser(userDocSnap.data());
            setShowBioModal(true);
        }
    };

    const openImageModal = (photo) => {
        setSelectedImage(photo.url);
        setShowImageModal(true);
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
                    customTransition="all .5"
                    transitionDuration={500}
                    containerClass="carousel-container"
                    removeArrowOnDeviceType={["tablet", "mobile"]}
                    itemClass="carousel-item-padding-40-px"
                >
                    {filteredPhotos.map((photo) => (
                        <div key={photo.id} className="photo-container" onClick={() => openImageModal(photo)}>
                            <img
                                src={photo.url}
                                alt={photo.tag}
                                className="photo-frame"
                            />
                            <div className="photo-details">
                                <h5>{photo.tag}</h5>
                                <p onClick={(e) => handleUserNameClick(photo.userId, e)}>
                                    Uploaded by: {usernames[photo.userId] || 'Unknown'}
                                </p>
                            </div>
                        </div>
                    ))}
                </Carousel>
            </div>
             {/* User Bio Modal */}
             <Modal show={showBioModal} onHide={() => setShowBioModal(false)}>
    <Modal.Header closeButton>
        <Modal.Title>{selectedUser ? selectedUser.username : ''}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        {selectedUser ? (
            <>
                <div className="avatar-container"> {/* Open avatar container div */}
                    {selectedUser.avatar && (
                        <img 
                            src={selectedUser.avatar} 
                            alt="Avatar" 
                            style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }} 
                        />
                    )}
                </div> {/* Close avatar container div */}
                <p>{selectedUser.bio || 'No bio available'}</p>
            </>
        ) : (
            <p>Loading...</p>
        )}
    </Modal.Body>
</Modal>
             {/* Image Modal */}
            <Modal show={showImageModal} onHide={() => setShowImageModal(false)} size="lg" centered>
                <Modal.Body>
                    {selectedImage && <img src={selectedImage} alt="Full Size" style={{ width: '100%' }} />}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default PublicGallery;
