import React from 'react'
import Upload from '../components/svg/Upload'
import { Form, Button } from 'react-bootstrap'


function MessageForm({ text, setText, handleSubmit, setImg, img, loading }) {
    return (
        <Form onSubmit={handleSubmit} style={{ position: "absolute", bottom: 0, right: 0, width: "100%", background: 'white' }} className="d-flex align-items-center justify-content-center b-top pt-2 mx-auto">

            <label htmlFor="img-msg">
                <Upload img={img} />
            </label>
            <input accept="image/*" type="file" id="img-msg" style={{ display: "none" }} onChange={e => setImg(e.target.files[0])} />
            {
                img && <small className="btn btn-link p-0" onClick={e => {
                    setImg('')
                }}>cancel</small>
            }
            <Form.Control disabled={loading} type="text" placeholder="Type Message" value={text} onChange={(e) => setText(e.target.value)} className="mx-2" />
            <Button disabled={loading} variant="primary" type="submit">
                Send
            </Button>

        </Form>
    )
}

export default MessageForm
