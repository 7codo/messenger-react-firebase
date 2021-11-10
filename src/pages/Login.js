import React, { useState } from 'react'
import { Form, Button, Container, Alert } from 'react-bootstrap'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../firebase'
import { doc, updateDoc } from '@firebase/firestore'
import { useNavigate } from 'react-router-dom';

function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')
        if (!email || !password) {
            setError('All fiels are required')
        }
        try {
            setLoading(true)
            const result = await signInWithEmailAndPassword(auth, email, password);

            await updateDoc(doc(db, 'users', result.user.uid), {
                isOnline: true
            })
            setEmail('')
            setPassword('')
            navigate('/')
            setError('')
            navigate('/')
        } catch (error) {
            let errMsg = error.message
            if (error.message.includes('Firebase: ')) {
                errMsg = error.message.substring('Firebase: '.length)
            }
            setError(errMsg)
        }
        setLoading(false)
    }

    return (
        <Container>
            <section className="auth-section mx-auto mt-5 p-3 rounded-3 shadow-lg">
                <h2 className="text-center">Log In</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" name="email" placeholder="Enter email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>

                    <Button disabled={loading} variant="primary" type="submit" className="w-100">
                        {loading ? 'Log In....' : 'Log In'}
                    </Button>
                </Form>
            </section>
        </Container>
    )
}

export default Login
