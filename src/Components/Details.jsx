import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './styles/details.css'
import fetchData from '../axios/getPosts'
import DetailBlog from './DetailBlog';

const Details = () => {
    const token = localStorage.getItem('token')
    const { state } = useLocation();
    const { id } = useParams();
    const [post, setPost] = useState()
    const [render, setRender] = useState(0)

    useEffect(() => {
        if (state) {
            setPost(state.data)
        } else {
            const get = async () => {
                if (token) {
                    const post = await fetchData(token, 'post', null, id)
                    setPost(post)
                } else {
                    const post = await fetchData(null, 'explore', null, id)
                    setPost(post)
                }
            }
            get()
        }
    }, [state, id, render])

    return (
        <>
            {post &&
                <div className='details'>
                    <div className="container">
                        <DetailBlog post={post} setRender={setRender} token={token} />
                    </div>
                    <ToastContainer />
                </div>
            }
        </>
    );
};

export default Details;