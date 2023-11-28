import React, { useState, useEffect } from 'react';
import { Container, Modal, Form, Row, Col } from 'react-bootstrap';
import { db } from '../firebase-config';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

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
            setSelectedUser(userDocSnap.data());
            setShowBioModal(true);
        }
    };

    const filteredPhotos = sharedPhotos.filter(photo => {
        return (filterCategory ? photo.category === filterCategory : true) &&
               (searchTerm ? photo.tag.toLowerCase().includes(searchTerm.toLowerCase()) : true) &&
               (filterUsername ? usernames[photo.userId]?.toLowerCase().includes(filterUsername.toLowerCase()) : true);
    });

    const responsive = {
      desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 3
      },
      tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2
      },
      mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
      }
    };

    return (
        <Container>
            <h1>Public Gallery</h1>
            <Row className="mb-4">
                {/* Filters */}
                {/* ... */}
            </Row>
            <Carousel
                swipeable={true}
                draggable={true}
                showDots={true}
                responsive={responsive}
                ssr={true} // means to render carousel on server-side.
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
       <div key={photo.id} style={{ textAlign: 'center', height: '50vh' }}> {/* Set the height to 50vh here */}
       <img
           src={photo.url}
           alt={photo.tag}
           style={{ 
               maxHeight: '100vh', // Set the max height to 50vh
               maxWidth: '100%', // Make sure the image is not wider than the container
               height: 'auto', // Maintain the aspect ratio
               width: 'auto', // Maintain the aspect ratio
               display: 'inline-block', 
               margin: '0 auto' 
           }}
       />
       <div style={{ textAlign: 'center' }}>
           <h5>{photo.tag}</h5>
           <p onClick={() => handleUserNameClick(photo.userId)}>
               Uploaded by: {usernames[photo.userId] || 'Unknown'}
           </p>
       </div>
   </div>
                ))}
            </Carousel>
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
