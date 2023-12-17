import React, { useState, useEffect } from 'react';
import { Container, Modal } from 'react-bootstrap';
import { db } from '../firebase-config';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './PublicGallery.css';

const PublicGallery = () => {
    const [sharedPhotos, setSharedPhotos] = useState([]);
    const [usernames, setUsernames] = useState({});
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

    const handleUserNameClick = async (userId) => {
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
                    {sharedPhotos.map((photo) => (
                        <div key={photo.id} className="photo-container" onClick={() => openImageModal(photo)}>
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
            <Modal show={showImageModal} onHide={() => setShowImageModal(false)} size="lg" centered>
                <Modal.Body>
                    {selectedImage && <img src={selectedImage} alt="Full Size" style={{ width: '100%' }} />}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default PublicGallery;
