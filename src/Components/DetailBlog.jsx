import React, { useRef, useEffect } from 'react';
import userlogo from './images/Ei-user.svg'
import { Link, useHistory } from 'react-router-dom';
import Comment from './Comment.jsx'
import Like from './Like';
import { DeletePost } from '../axios/managePost';

const DetailBlog = ({ post, token }) => {
    const { title, body, status, id, images } = post
    const history = useHistory();
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
                    <div className="d-flex align-items-center">
                        <div className='authorImg'>
                            {post.profile ?
                                <img src={post.profile} alt='author' />
                                :
                                <img src={userlogo} alt='author' />
                            }
                        </div>
                        <Link className='pmibgt' to={`/${post.author}`}>{post.author}</Link>
                    </div>
                    {
                        true &&
                        <div className="phWxoR">
                            <input type="checkbox" id={`optionBlog${id}`} hidden />
                            <label htmlFor={`optionBlog${id}`} className="XsPzoY">
                                <svg viewBox="0 0 16 16">
                                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                </svg>
                            </label>
                            <div className="jWcoI">
                                <ul>
                                    <li onClick={() => DeletePost(id).then(() => history.goBack())}>DELETE</li>
                                    <li><Link to={{ pathname: `/account/Blog-Option/`, state: { title, body, status, id, images } }}>EDIT</Link></li>
                                </ul>
                            </div>
                        </div>
                    }
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
                        <div className="postFooter justify-content-between px-3 mt-3">
                            <div className="QpmuVis d-flex">
                                <span className='me-3'>{post.created.slice(0, 4) + ' / ' + post.created.slice(4, 6) + ' / ' + post.created.slice(6, 8)}</span>
                                <span>{post.created.slice(8, 10) + ' : ' + post.created.slice(10, 12)}</span>
                                <div className="post_action">
                                    <Like id={post.id} status_like={post.status_like} like={post.like} />
                                </div>
                            </div>
                            {post.created !== post.updated && <span className='edited'>edited</span>}
                        </div>
                    </div>
                </div>
                <Comment token={token} id={post.id} />
            </div>
        </>
    );
};

export default DetailBlog;