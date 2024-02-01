import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Modal, Image, Alert, Button, Form } from 'react-bootstrap';
import { storage, db, auth } from '../firebase-config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, getDoc, updateDoc, collection, addDoc, query, where, onSnapshot, deleteDoc, setDoc } from 'firebase/firestore';
import Resizer from 'react-image-file-resizer';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [tag, setTag] = useState('');
  const [category, setCategory] = useState('');
  const [userPhotos, setUserPhotos] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        setUser(docSnap.data());
      }

      const photosRef = collection(db, 'photos');
      const q = query(photosRef, where("userId", "==", auth.currentUser.uid));
      onSnapshot(q, (querySnapshot) => {
        setUserPhotos(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
    };

    fetchUserData();
  }, []);

  const handleProfileUpdate = async (updatedUser) => {
    const userDocRef = doc(db, 'users', auth.currentUser.uid);
  
    // Handle avatar upload if there is a new avatar file
    if (updatedUser.avatar instanceof File) {
      const avatarRef = ref(storage, `avatars/${auth.currentUser.uid}/${updatedUser.avatar.name}`);
      const snapshot = await uploadBytes(avatarRef, updatedUser.avatar);
      updatedUser.avatar = await getDownloadURL(snapshot.ref);
    }
  
    // Check if the user document exists and create it if not, otherwise update
    const docSnap = await getDoc(userDocRef);
    if (!docSnap.exists()) {
      await setDoc(userDocRef, updatedUser);
    } else {
      await updateDoc(userDocRef, updatedUser);
    }
  
    setUser(prevState => ({ ...prevState, ...updatedUser }));
    setShowModal(false);
  };

  const resizeFile = (file) => new Promise(resolve => {
    Resizer.imageFileResizer(
      file,
      300, // max width
      300, // max height
      'JPEG',
      100, // quality
      0, // rotation
      uri => {
        resolve(uri);
      },
      'blob'
    );
  });

  const handlePhotoUpload = async () => {
    if (!photoFile || !tag || !category) {
      setError("Please select a photo, tag, and category!");
      return;
    }
    try {
      const resizedImage = await resizeFile(photoFile);
      const photoRef = ref(storage, `photos/${auth.currentUser.uid}/${photoFile.name}`);
      const snapshot = await uploadBytes(photoRef, resizedImage);
      const photoUrl = await getDownloadURL(snapshot.ref);
      await addDoc(collection(db, 'photos'), {
        userId: auth.currentUser.uid,
        url: photoUrl,
        tag,
        category,
        shared: false
      });
      setPhotoFile(null);
      setTag('');
      setCategory('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeletePhoto = async (photoId, photoUrl) => {
    try {
      const photoDocRef = doc(db, 'photos', photoId);
      await deleteDoc(photoDocRef);
      const fileRef = ref(storage, photoUrl);
      await deleteObject(fileRef);
    } catch (error) {
      setError(error.message);
    }
  };

  const togglePhotoShare = async (photoId, shared) => {
    const photoDocRef = doc(db, 'photos', photoId);
    await updateDoc(photoDocRef, { shared: !shared });
  };

  const openImageModal = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setShowImageModal(true);
  };

  const resetError = () => setError('');

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="profile-container">
        <Col md={6} className="photo-upload-section">
          <Form className="section-photo-upload">
            <Form.Group controlId="photo-upload" className="short-input">
              <Form.Label>Upload New Photo</Form.Label>
              <Form.Control type="file" onChange={(e) => { setPhotoFile(e.target.files[0]); resetError(); }} />
            </Form.Group>
            <Form.Group controlId="photo-tag" className="short-input">
              <Form.Label>Tag</Form.Label>
              <Form.Control type="text" value={tag} onChange={(e) => { setTag(e.target.value); resetError(); }} />
            </Form.Group>
            <Form.Group controlId="photo-category" className="short-input">
              <Form.Label>Category</Form.Label>
              <Form.Control as="select" value={category} onChange={(e) => { setCategory(e.target.value); resetError(); }}>
                <option value="">Select a category</option>
                <option value="Nature">Nature</option>
                <option value="Animals">Animals</option>
                <option value="People">People</option>
                <option value="Technology">Technology</option>
              </Form.Control>
            </Form.Group>
            <Button className="custom-button-reverse" onClick={handlePhotoUpload}>Upload Photo</Button>
          </Form>
        </Col>
        <Col md={6} className="profile-info-section">
          <div className="profile-info">
            <Image
              src={user.avatar || 'https://via.placeholder.com/150'}
              alt="Profile Avatar"
              roundedCircle
              className="mb-3"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
            <h2>{user.username || 'Your Name'}</h2>
            <p>{user.bio || 'Your bio here'}</p>
            <Button className="custom-button-reverse" onClick={() => setShowModal(true)}>Edit Profile</Button>
          </div>
        </Col>
      </Row>
      <Row xs={1} md={3} className="g-4 mt-3">
        {userPhotos.map(photo => (
          <Col key={photo.id} className="mb-3">
            <Card className="h-100">
              <Card.Img variant="top" src={photo.url} onClick={() => openImageModal(photo.url)} style={{ height: '200px', objectFit: 'cover' }} />
              <Card.Body>
                <Card.Title>{photo.tag}</Card.Title>
                <div className="card-button-container">
                  <Button className="photo-card-button" onClick={() => togglePhotoShare(photo.id, photo.shared)}>
                    {photo.shared ? "Unshare" : "Share"}
                  </Button>
                  <Button className="photo-card-button-delete" onClick={() => handleDeletePhoto(photo.id, photo.url)}>
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} size="lg">
        <Modal.Body>
          <img src={selectedImageUrl} style={{ width: '100%' }} alt="Full Size" />
        </Modal.Body>
      </Modal>
      <ProfileUpdateModal show={showModal} handleClose={() => setShowModal(false)} user={user} handleProfileUpdate={handleProfileUpdate} />
    </Container>
  );
};

const ProfileUpdateModal = ({ show, handleClose, user, handleProfileUpdate }) => {
  const [updatedUser, setUpdatedUser] = useState(user);

  useEffect(() => {
    setUpdatedUser(user);
  }, [user]);

  const onSubmit = () => {
    handleProfileUpdate(updatedUser);
    handleClose();
  };

  const handleFileChange = (event) => {
    setUpdatedUser({ ...updatedUser, avatar: event.target.files[0] });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" name="username" value={updatedUser.username || ''} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="bio">
            <Form.Label>Bio</Form.Label>
            <Form.Control as="textarea" name="bio" rows={3} value={updatedUser.bio || ''} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="avatar">
            <Form.Label>Avatar</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={onSubmit}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Profile;