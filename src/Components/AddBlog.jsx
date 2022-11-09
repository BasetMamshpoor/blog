import React, { useLayoutEffect, useEffect, useState } from 'react';
import './styles/addBlog.css'
import SendPostData from '../axios/SendPostData'
import { EditPost } from '../axios/managePost';
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
    const [addPost, setAddPost] = useState({ title: '', body: '', uplouded_images: [], status: 'PU', images: [] })
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
        e.preventDefault();
        if (Object.keys(error).length > 0) {
            setTouch({ title: true, body: true })
        } else {
            await EditPost(addPost)
                .then(() => history.push(`/${localStorage.getItem('username')}`))
                .catch(() => notify('error', 'something is wrong!'))
        }
    }
    const handleFocus = (e) => {
        setTouch(prev => { return { ...prev, [e.target.name]: true } })
    }
    const handleImageOption = (e) => {
        const name = parseInt(e.target.name)
        setAddPost(prev => {
            const { images } = prev
            if (!images.includes(name)) {
                images.push(name);
            } else {
                images.splice(images.indexOf(name), 1);
            }
            return { ...prev }
        })
    }
    const ImageList = state && state.images.length > 0 && state.images.map(i => {
        return (
            <div key={i.id} className="ExBt_2">
                <input
                    type="checkbox"
                    name={i.id}
                    id={`image${i.id}`}
                    hidden
                    onChange={handleImageOption}
                />
                <label htmlFor={`image${i.id}`} className="image_holder">
                    <img src={i.image} alt="imagePost" width='100%' />
                </label>
            </div>
        )
    })
    return (
        <>
            {
                <div className='wQio mb-5'>
                    <div className="tab-pane" id="post-object-form">
                        <form encType='multipart/form-data' className="form-horizontal" onSubmit={state ? handleEditPost : handleSendData}>
                            <fieldset>
                                <div className="form-group ">
                                    <label className="control-label">Title</label>
                                    <input name="title" className="form-control" type="text" value={addPost.title} onFocus={handleFocus} onChange={handleChange} />
                                    {touch.title && error.title && <p>{error.title}</p>}
                                </div>
                                <div className="form-group">
                                    <label className="control-label">Body</label>
                                    <textarea name="body" value={addPost.body} onFocus={handleFocus} onChange={handleChange} className="form-control"></textarea>
                                    {touch.body && error.body && <p>{error.body}</p>}
                                </div>
                                {state && state.images.length > 0 &&
                                    <div className="form-group">
                                        <label className="control-label">select image to delete!</label>
                                        <div className="OvrcU d-flex">
                                            {ImageList}
                                        </div>
                                    </div>
                                }
                                <div className="form-group">
                                    <label className="control-label">{state ? 'add new image' : 'images'}</label>
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