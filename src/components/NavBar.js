import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Container, Nav, Button } from 'react-bootstrap'
import { auth, db } from '../firebase'
import { updateDoc, doc } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { useAuth } from '../contexts/auth'

function NavBar() {
    const { currentUser } = useAuth();
    const navigate = useNavigate()

    const handleLogOut = async (e) => {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            isOnline: false
        })
        await signOut(auth);
        navigate('/login')
    }

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Link to="/" className="navbar-brand">Jungo</Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ms-auto">
                        {
                            currentUser ?
                                <>
                                    <Link className="nav-link" to="/profile">Profile</Link>
                                    <Button variant="link" className="nav-link text-start" onClick={handleLogOut}>
                                        Log Out
                                    </Button>
                                </> :
                                <>
                                    <Link className="nav-link" to="/signup">Sign Up</Link>
                                    <Link className="nav-link" to="/login">
                                        Log In
                                    </Link>
                                </>

                        }

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar
