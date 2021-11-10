import React, { useState } from 'react'
import { Form, Button, Container, Alert } from 'react-bootstrap'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../firebase'
import { doc, setDoc, Timestamp } from '@firebase/firestore'
import { useNavigate } from 'react-router-dom';

function Register() {

    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        loading: false,
    })
    const [error, setError] = useState('')
    const { name, email, password, loading } = data
    const navigate = useNavigate();

    const handleChange = e => {
        setData({ ...data, [e.target.name]: e.target.value })

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            setError('All fiels are required')
        }

        try {
            setData({ ...data, loading: true })

            const result = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, 'users', result.user.uid), {
                uid: result.user.uid,
                name,
                email,
                createdAt: Timestamp.fromDate(new Date()),
                isOnline: true
            });
            setData({ ...data, name: '', email: '', password: '' })
            setError('')
            navigate('/');
        } catch (error) {
            let errMsg = error.message
            if (error.message.includes('Firebase: ')) {
                errMsg = error.message.substring('Firebase: '.length)
            }
            setError(errMsg)

        }
        setData({ ...data, loading: false })
    }

    return (
        <Container>
            <section className="auth-section mx-auto mt-5 p-3 rounded-3 shadow-lg">
                <h2 className="text-center">Sign Up</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form className="" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name="name" placeholder="Enter you full name" required value={name} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" name="email" placeholder="Enter email" required value={email} onChange={handleChange} />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" name="password" required value={password} onChange={handleChange} />
                    </Form.Group>

                    <Button disabled={loading} variant="primary" type="submit" className="w-100">
                        {loading ? 'Sign Up....' : 'Sign Up'}
                    </Button>
                </Form>
            </section>
        </Container>
    )
}

export default Register
