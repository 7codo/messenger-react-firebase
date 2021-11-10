import React, { useState, useEffect } from 'react'
import { Container, Card, Row, Col, Image, Stack, Form, ListGroup, Spinner } from 'react-bootstrap'
import Avatar from '../assets/imgs/avatar.png'
import { ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage'
import { storage, db, auth } from '../firebase';
import { getDoc, doc, updateDoc } from '@firebase/firestore';
import Loading from '../components/Loading';



function Profile() {
    const [pic, setPic] = useState(null);
    const [userData, setUserData] = useState();
    const [loading, setLoading] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

    useEffect(() => {

        try {
            const getUserData = async () => {
                //getDoc(document reference) -> reads the document referred to document reference !return document snapshot
                //doc(firestore, path, path segments) -> gets a document referrence at absulte path
                await getDoc(doc(db, `users`, auth.currentUser.uid)).then((docSnap) => {
                    //return user data in doc snap
                    if (docSnap.exists()) {
                        setUserData(docSnap.data())

                    }
                })
            }
            getUserData()
        } catch (error) {

        }

        if (pic) {
            const uploadImg = async () => {
                setLoading(true);
                try {
                    //ref(storage, url(folder location + file name)) -> return storage reference 

                    if (!isDeleted && userData.avatarPath) {
                        await deleteObject(ref(storage, userData.avatarPath))
                    }
                    const imgRef = ref(storage, `avatar/${new Date().getTime()} - ${pic.name}`)
                    //uploadBytes(reference, data(file)) -> upload data 
                    const snap = await uploadBytes(imgRef, pic)
                    //getDownloadURL(REF(STORAGE, FILE PATH)) -> return the download url 
                    const url = await getDownloadURL(ref(storage, snap.ref.fullPath))
                    //updateDoc(doc) -> update the document referred to document reference
                    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                        avatar: url,
                        avatarPath: snap.ref.fullPath
                    })
                    setPic('')
                } catch (error) {

                }
            }
            setIsDeleted(false)
            uploadImg();
            setLoading(false)
        }
    }, [pic])


    const onDeleteAvatar = async () => {
        setLoading(true)
        try {
            const confirm = window.confirm('Delete Avatar?')
            if (confirm, userData.avatarPath) {
                await deleteObject(ref(storage, userData.avatarPath))
                await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                    avatar: '',
                    avatarPath: ''
                })
            }
            setIsDeleted(true)
        } catch (err) {
            setIsDeleted(false)
        }
        setLoading(false)

    }

    return (
        userData ?
            <Container>
                <Card className="auth-section mx-auto mt-5 p-3">
                    <Card.Body>
                        <div gap={3} className="d-flex flex-column justify-content-center align-items-center profile-card">
                            <Row>
                                <Col className="mb-2 profile-pic">
                                    <Image style={{ width: "10em", height: "10em" }} src={isDeleted ? Avatar : (userData.avatar || Avatar)} roundedCircle />

                                </Col>
                            </Row>
                            <Stack>
                                <Card.Title as={'h1'}>{userData.name}</Card.Title>
                                <Card.Text as="div">
                                    <ListGroup as="ul">
                                        <ListGroup.Item as="li" active>
                                            <strong>Email: </strong> {userData.email}
                                        </ListGroup.Item>
                                        <ListGroup.Item as="li">
                                            <strong>Joined on: </strong> {userData.createdAt.toDate().toDateString()}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card.Text>
                                <Stack direction="horizontal" className="mt-2">
                                    <Form.Group controlId="pic">
                                        <Form.Label className="btn btn-link">Change Your Image </Form.Label>

                                        <Form.Control type="file" accept="image/*" style={{ display: 'none' }} onChange={(event) => setPic(event.target.files[0])} />
                                    </Form.Group>

                                    {(userData.avatarPath && !isDeleted) && <Form.Label onClick={onDeleteAvatar} className="btn btn-link text-danger">Delete </Form.Label>}
                                    {
                                        loading && <Spinner animation="border" role="status" size="sm">
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                    }
                                </Stack>

                            </Stack>
                        </div>
                    </Card.Body>

                </Card>
            </Container >
            :
            <Loading />
    )
}

export default Profile
