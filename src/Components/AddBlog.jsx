import React, { useLayoutEffect } from 'react';
import { useState } from 'react';
import './styles/addBlog.css'
import SendPostData from '../axios/SendPostData'
import { ToastContainer } from 'react-toastify';
import notify from '../Auth/toast'
import { useHistory } from 'react-router-dom';
import Navbar from './Navbar';


const validate = (obj) => {
    const error = {}
    if (!obj.title.trim()) {
        error.title = 'title can not be empty'
    } else {
        delete error.title
    }
    if (!obj.body.trim()) {
        error.body = 'body can not be empty'
    } else {
        delete error.body
    }
    return error;
}


const AddBlog = () => {
    const [addPost, setAddPost] = useState({ title: '', body: '', picture: null, status: 'PU' })
    const error = validate(addPost)
    const [touch, setTouch] = useState({ title: false, body: false })
    const token = localStorage.getItem('token')
    const history = useHistory();

    useLayoutEffect(() => {
        if (!token) history.push('/login')
    }, [token])

    const handleChange = event => {
        setAddPost(prev => {
            return {
                ...prev,
                [event.target.name]: event.target.value
            }
        })

    }
    const handleUpload = event => {
        setAddPost(prev => {
            return {
                ...prev,
                picture: event.target.files[0]
            }
        })
    }
    const handleSendData = async (e) => {
        e.preventDefault();
        if (Object.keys(touch).length < 1) {
            setTouch({ title: true, body: true })
        } else {
            await SendPostData(addPost, token)
                .then(() => history.goBack())
                .catch(() => notify('error', 'change the title!'))
        }
    }
    const handleFocus = (e) => {
        setTouch(prev => { return { ...prev, [e.target.name]: true } })
    }
    return (
        <><Navbar />
            {
                <div className='wQio'>
                    <div className="tab-pane" id="post-object-form">
                        <form encType='multipart/form-data' className="form-horizontal">
                            <fieldset>
                                <div className="form-group ">
                                    <label className="control-label">Title</label>
                                    <input name="title" className="form-control" type="text" value={addPost.title} onFocus={handleFocus} onChange={handleChange} />
                                    {touch.title && error.title && <p>{error.title}</p>}
                                </div>
                                <div className="form-group">
                                    <label className="control-label ">Body</label>
                                    <textarea name="body" value={addPost.body} onFocus={handleFocus} onChange={handleChange} className="form-control"></textarea>
                                    {touch.body && error.body && <p>{error.body}</p>}
                                </div>
                                <div className="form-group">
                                    <label className="control-label">Picture</label>
                                    <br />
                                    <input name="picture" type="file" onChange={handleUpload} accept='image/jpeg, image/jpg, image/png, image/gif' />
                                </div>
                                <div className="form-group">
                                    <label className="control-label ">Status</label>
                                    <select className="form-control" name="status" value={addPost.status} onChange={handleChange}>
                                        <option value="PU">Publish</option>
                                        {/* <option value="DR">Draft</option> */}
                                        {/* <option value="AR">Archive</option> */}
                                    </select>
                                </div>
                                <div className="form-actions">
                                    <button type='submit' className="js-tooltip" onClick={handleSendData}>POST</button>
                                    <button type="button" className='closeModal' onClick={() => history.goBack()}>CANCLE</button>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>

            }
            <ToastContainer />
        </>
    );
};

export default AddBlog;