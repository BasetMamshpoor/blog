import React, { useLayoutEffect, useEffect, useState } from 'react';
import './styles/addBlog.css'
import SendPostData, { EditPost } from '../axios/SendPostData'
import { ToastContainer } from 'react-toastify';
import notify from '../Auth/toast'
import { useHistory, useLocation } from 'react-router-dom';


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
    const { state } = useLocation();
    const [addPost, setAddPost] = useState({ title: '', body: '', uplouded_images: [], status: 'PU' })
    const error = validate(addPost)
    const [touch, setTouch] = useState({ title: false, body: false })
    const token = localStorage.getItem('token')
    const history = useHistory();

    useLayoutEffect(() => {
        if (!token) history.push('/login')
    }, [token, history])

    useEffect(() => {
        if (state) {
            setAddPost(prev => {
                const { title, body, status, id } = state
                return {
                    ...prev, title, body, status, id
                }
            })
        }
    }, [state])


    const handleChange = event => {
        setAddPost(prev => {
            return {
                ...prev,
                [event.target.name]: event.target.value
            }
        })

    }
    const handleUpload = ({ target }) => {
        setAddPost(prev => {
            return {
                ...prev,
                uplouded_images: [...prev.uplouded_images, ...target.files]
            }
        })
    }
    const handleSendData = async (e) => {
        e.preventDefault();
        if (Object.keys(error).length > 0) {
            setTouch({ title: true, body: true })
        } else {
            await SendPostData(addPost, token)
                .then(() => history.push('/'))
                .catch(() => notify('error', 'change the title!'))
        }
    }
    const handleEditPost = async (e) => {
        console.log(addPost);
        e.preventDefault();
        if (Object.keys(error).length > 0) {
            setTouch({ title: true, body: true })
        } else {
            await EditPost(addPost, token)
                .then(() => history.push(`/users/${localStorage.getItem('username')}`))
                .catch(() => notify('error', 'change the title!'))
        }
    }
    const handleFocus = (e) => {
        setTouch(prev => { return { ...prev, [e.target.name]: true } })
    }
    return (
        <>
            {
                <div className='wQio'>
                    <div className="tab-pane" id="post-object-form">
                        <form encType='multipart/form-data' className="form-horizontal" onSubmit={state ? handleEditPost : handleSendData}>
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
                                    <label className="control-label">images</label>
                                    <br />
                                    <input name="uplouded_images" multiple type="file" onChange={handleUpload} accept='image/jpeg, image/jpg, image/png, image/gif, image/webp' />
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
                                    {state ?
                                        <button type='submit' className="js-tooltip">EDIT</button>
                                        :
                                        <button type='submit' className="js-tooltip">POST</button>
                                    }
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