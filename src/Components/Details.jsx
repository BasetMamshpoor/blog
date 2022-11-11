import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './styles/details.css'
import getPost from '../axios/getPost'
import DetailBlog from './DetailBlog';
import UserNotFound from './NotFound/UserNotFound'
import Loading from './images/200.gif'


const Details = () => {
    const token = localStorage.getItem('token')
    const { state = {} } = useLocation();
    const { id } = useParams();
    const [post, setPost] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const get = async () => {
            await getPost(token, state.from, null, id)
                .then(res => {
                    setPost(res.data)
                    setLoading(false)
                })
                .catch(() => {
                    setLoading(false)
                    setPost(false)
                })
        }
        get()
    }, [id])

    return (
        <>
            {loading ? <div className="loading_holder"><img src={Loading} alt="" /></div> : post ?
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