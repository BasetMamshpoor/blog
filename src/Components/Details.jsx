import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './styles/details.css'
import getPost from '../axios/getPost'
import DetailBlog from './DetailBlog';
import UserNotFound from './NotFound/UserNotFound'

const Details = () => {
    const token = localStorage.getItem('token')
    const { state = {} } = useLocation();
    const { id } = useParams();
    const [post, setPost] = useState()

    useEffect(() => {
        const get = async () => {
            await getPost(token, state.from, null, id)
                .then(res => setPost(res.data))
                .catch(() => setPost(false))
        }
        get()
    }, [id])

    return (
        <>
            {post ?
                <div className='details'>
                    <div className="container">
                        <DetailBlog post={post} token={token} />
                    </div>
                    <ToastContainer />
                </div>
                : <UserNotFound value='Blog' />
            }
        </>
    );
};

export default Details;