import React from 'react'
import { Spinner, Container } from 'react-bootstrap'
function Loading() {
    return (
        <Container >
            <div className="d-flex vh-100 justify-content-center align-items-center">
                <Spinner animation="grow" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        </Container >
    )
}

export default Loading
