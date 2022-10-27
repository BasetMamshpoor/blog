import React, { useState, useRef, useEffect } from 'react';
import userlogo from './images/Ei-user.svg'
import notify from '../Auth/toast'
import axios from 'axios';
import { Link } from 'react-router-dom';

const DetailBlog = ({ post, setRender, token }) => {
    const [comment, setComment] = useState('')
    const slider = useRef()
    useEffect(() => {
        if (slider.current !== undefined) {
            const buttons = slider.current.children[1].children
            let slideIndex = 1
            showSlides(slideIndex)
            buttons[0].addEventListener('click', () => {
                handleSlide(-1)
            })
            buttons[1].addEventListener('click', () => {
                handleSlide(1)
            })
            function handleSlide(n) {
                showSlides(slideIndex += n)
            }
            function showSlides(n) {
                const num = slider.current.children[0].children
                if (n > num.length) slideIndex = num.length
                if (slideIndex == num.length) buttons[1].style.display = 'none'
                else buttons[1].style.display = 'block'
                if (n < 1) slideIndex = 1
                if (slideIndex == 1) buttons[0].style.display = 'none'
                else buttons[0].style.display = 'block'
                for (let i = 0; i < num.length; i++) {
                    num[i].className = num[i].className.replace(' showSlide', '');
                }
                num[slideIndex - 1].className += ' showSlide'
            }
        }
    }, [slider])


    const comments = post && post.comments.map(c => {
        return (
            <div className="comment" key={c.id}>
                <div className="headerC">
                    <p>{c.owner}</p>
                </div>
                <div className="bodyC">
                    <p>{c.body}</p>
                </div>
                <div className="csxop">
                    <span className='me-3'>{c.created.slice(0, 4) + ' / ' + c.created.slice(4, 6) + ' / ' + c.created.slice(6, 8)}</span>
                    <span>{c.created.slice(8, 10) + ' : ' + c.created.slice(10, 12)}</span>
                </div>
            </div>
        )
    })
    const handleComment = async (e) => {
        e.preventDefault()
        if (!token) notify('error', 'Please Login')
        else if (comment.trim()) {
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
    const pictures = post && post.images.length > 1 && post.images.map(img => {
        return (
            <div className='mySlide' key={img.id}>
                <img src={img.image} alt='blogImg' />
            </div>
        )
    })

    return (
        <>
            <div className='post'>
                <div className='postAuthor'>
                    <div className='authorImg'>
                        <img src={userlogo} alt='author' width='60px' />
                    </div>
                    <Link to={`/users/${post.author}`}>{post.author}</Link>
                </div>
                <div className='postInfo'>
                    {post.images.length > 1 &&
                        <div className='blogImg' ref={slider}>
                            <div className="slidesPo">
                                {pictures}
                            </div>
                            <div className='arrowSl'>
                                <a className="prev">❮</a>
                                <a className="next">❯</a>
                            </div>
                        </div>
                    }
                    {post.images.length > 0 && post.images.length < 2 &&
                        <div className='blogimg'>
                            <div className="qxolps">
                                <img src={post.images[0].image} alt="blog" />
                            </div>
                        </div>
                    }
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
        </>
    );
};

export default DetailBlog;