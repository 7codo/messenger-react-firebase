import React, { useEffect, useState } from "react";
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    orderBy,
    Timestamp,
    setDoc,
    doc,
    getDoc,
    updateDoc
} from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { Container, Stack, Col, Row } from "react-bootstrap";
import User from "../components/User";
import Loading from "../components/Loading";
import MessageForm from "../components/MessageForm";
import { getDownloadURL, uploadBytes, ref } from "@firebase/storage";
import Message from "../components/Message";

function Home() {
    const [users, setUsers] = useState();
    const [chatTo, setChatTo] = useState("");
    const [msg, setMsg] = useState("");
    const [attachImg, setAttachImg] = useState("");
    const [msgs, setMsgs] = useState([])
    const [processing, setProcessing] = useState(false)
    const sender = auth.currentUser.uid;

    useEffect(() => {
        const usersRef = collection(db, "users");
        // create query object
        const q = query(usersRef, where("uid", "not-in", [sender]));
        // execute query
        const unsub = onSnapshot(q, (querySnapshot) => {
            let users = [];
            querySnapshot.forEach((doc) => {
                users.push(doc.data());
            });
            setUsers(users);
        });
        return () => unsub();
    }, [sender]);

    const selectUser = async (userSelected) => {
        //empty attached img 
        setAttachImg('');
        setChatTo(userSelected);
        const receiver = chatTo.uid;

        const collId = sender > receiver ? `${sender + receiver}` : `${receiver + sender}`;
        const msgRef = collection(db, 'messages', collId, 'chat')
        const q = query(msgRef, orderBy("createdAt", 'asc'))
        onSnapshot(q, (qSnap) => {
            let msgs = []
            qSnap.forEach((doc) => {

                msgs.push(doc.data())
            })
            setMsgs(msgs)

        })

        // get last message b/w logged in user and selected user
        const docSnap = await getDoc(doc(db, "lastMsg", collId));
        // if last message exists and message is from selected user
        if (docSnap.data() && docSnap.data().from !== sender) {
            // update last message doc, set unread to false
            await updateDoc(doc(db, "lastMsg", collId), { unread: false });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (msg || attachImg) {
            setProcessing(true)
            const receiver = chatTo.uid;
            const collId =
                sender > receiver ? `${sender + receiver}` : `${receiver + sender}`;
            let attachUrl;
            if (attachImg) {
                const attachRef = ref(storage, `images/${new Date().getTime()} - ${attachImg.name}`)
                const snap = await uploadBytes(attachRef, attachImg)
                const imgUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
                attachUrl = imgUrl;
            }

            await addDoc(collection(db, "messages", collId, "chat"), {
                text: msg,
                from: sender,
                to: receiver,
                createdAt: Timestamp.fromDate(new Date()),
                media: attachUrl || ""

            });

            //if the collection exists override otherwise create one

            await setDoc(doc(db, 'lastMsg', collId), {
                text: msg,
                from: sender,
                to: receiver,
                createdAt: Timestamp.fromDate(new Date()),
                media: attachUrl || "",
                unread: true
            })

            setProcessing(false)
            setAttachImg('')
            setMsg('')
        }

    };

    if (!users) {
        return <Loading />;
    }

    return (
        <Container>
            <Row>
                <Col xs={3}>
                    <Stack
                        style={{ height: "calc(100vh - 58px)" }}
                        className="b-right overflow-auto my-2"
                    >
                        {users.map((user) => (
                            <User key={user.uid} selectUser={selectUser} user={user} chatTo={chatTo} user1={sender} />
                        ))}
                    </Stack>
                </Col>
                <Col xs={9}>
                    <Stack
                        direction="vertical"
                        style={{ height: "calc(100vh - 75px)", position: "relative" }}
                        className="my-2 text-center"
                    >
                        {chatTo ? (
                            <>
                                <h2 className="b-bottom pb-2">
                                    {chatTo.name}
                                </h2>
                                <section className="overflow-auto mb-2" style={{ height: "86%" }}>
                                    {msgs && msgs.map((msg, index) => <Message key={index} msg={msg} sender={sender} />)}
                                </section>
                                <MessageForm loading={processing} handleSubmit={handleSubmit} text={msg} setText={setMsg} setImg={setAttachImg} img={attachImg} />
                            </>
                        ) : (
                            <h2>Select a user to start the conversition</h2>
                        )}
                    </Stack>
                </Col>
            </Row>
        </Container>
    );
}

export default Home;
