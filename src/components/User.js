import React, { useEffect, useState } from 'react'
import { Image, Stack } from 'react-bootstrap'
import Avatar from '../assets/imgs/avatar.png'
import { onSnapshot, doc } from 'firebase/firestore'
import { db } from '../firebase'
function User({ user, user1, selectUser, chatTo }) {

    const user2 = user?.uid;
    const [data, setData] = useState("");

    useEffect(() => {
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
        let unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
            setData(doc.data());
        });
        return () => unsub();
    }, [])


    return (
        <Stack direction="horizontal" className={`user-tab mb-2 ${user.name === chatTo.name && 'active'}`} style={{ position: "relative", cursor: 'pointer' }} onClick={() => selectUser(user)}>
            <Image src={user.avatar || Avatar} alt="avatar" className="me-2" roundedCircle style={{ width: "3em", height: "3em" }} />
            <div className="entry-name">
                <h4 className="fs-5">{user.name}</h4>
                {
                    data?.from !== user1 && data?.unread &&
                    <div>
                        <strong>{data.from === user1 ? 'Me:' : null}</strong>
                        <small>{data.text} </small>
                        <span className="new-dot"></span>
                    </div>
                }
            </div>
            <div style={{ width: "10px", height: "10px", position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }} className={`dot-line me-2 rounded-circle ${user.isOnline ? 'bg-success' : 'bg-danger'}`}></div>
        </Stack>
    )
}

export default User
