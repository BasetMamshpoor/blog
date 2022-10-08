import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import userlogo from './images/Ei-user.svg'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import getPosts from '../axios/getPosts';
import './styles/details.css'
import axios from 'axios';

const Details = () => {
    const token = localStorage.getItem('token')
    const { id } = useParams();
    const [post, setPost] = useState()
    const [comment, setComment] = useState('')
    const [render, setRender] = useState(0)
    useEffect(() => {
        const get = async () => {
            const post = await getPosts(id)
            setPost(post)
        }
        get()
    }, [id, render])

    const comments = post && post.comments.map(c => {
        return (
            <div className="comment" key={c.id}>
                <div className="headerC">
                    <p>{c.owner}</p>
                </div>
                <div className="bodyC">
                    <p>{c.body}</p>
                </div>
            </div>
        )
    })
    const handleComment = async (e) => {
        e.preventDefault()
        if (comment.trim()) {
            await axios.post('posts/comment/', { 'body': comment, 'post': post.id }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            })
                .then(() => {
                    setRender(Math.random())
                    setComment('')
                })
        }
    }
    return (
        <>
            {post &&
                <div className='details pt-5'>
                    <div className="container">
                        <div className='post' >
                            <div className='postAuthor'>
                                <div className='authorImg'>
                                    <img src={userlogo} alt='author' width='60px' />
                                </div>
                                <Link to={`/users/${post.author}`}>{post.author}</Link>
                            </div>
                            <div className='postInfo'>
                                <div className='postImg'>
                                    {post.picture && <img src={post.picture} alt='blog' />}
                                </div>
                                <div className='aboutPost'>
                                    <h4 dir='auto'>{post.title}</h4>
                                    <p dir='auto'>{post.body}</p>
                                    <div className="postFooter">
                                        <span className='me-3'>{post.created.slice(0, 4) + ' / ' + post.created.slice(4, 6) + ' / ' + post.created.slice(6, 8)}</span>
                                        <span>{post.created.slice(8, 10) + ' : ' + post.created.slice(10, 12)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="postComment">
                                <h5>comments</h5>
                                <div className="commentForm">
                                    <form encType='multipart/form-data'>
                                        <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} />
                                        <button onClick={handleComment}>Send</button>
                                    </form>
                                </div>
                                <div className="commentList">
                                    {comments}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default Details;