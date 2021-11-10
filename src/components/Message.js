import React, { useRef, useEffect } from 'react'
import { Stack, Badge, Image } from 'react-bootstrap'
import Moment from 'react-moment'
function Message({ msg, sender }) {

    const scrollRef = useRef();
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behaviour: 'smooth' })
    }, [msg])
    return (
        <Stack direction="vertical" style={{ width: "47%" }} className={`mb-3 ${msg.from === sender ? 'ms-auto' : ''} `} ref={scrollRef}>
            {msg.media && <Image src={msg.media} alt={msg.text} style={{ maxWidth: "50%" }} />}
            < Badge bg={`${msg.from === sender ? 'primary' : 'dark text-light'}`} className="fs-6 py-2 text-wrap"  >
                {msg.text}
            </Badge >
            <small className={` w-50 bg-light rounded msg-date ${msg.from === sender ? 'ms-auto' : ''}`}><Moment fromNow>{msg.createdAt.toDate()}</Moment></small>
        </Stack >
    )
}

export default Message
