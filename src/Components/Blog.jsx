import React, { useEffect, useRef } from 'react';
import './styles/blog.css';
import userlogo from './images/Ei-user.svg'
import { Link } from 'react-router-dom';
import { DeletePost } from '../axios/managePost';
import Like from './Like';


const Blog = ({ data, setBlogs, from, link = true }) => {
    const { id, author, profile, images, title, body, status, created, updated, like, status_like } = data
    const slider = useRef();


    const pictures = images.length > 1 && images.map(img => {
        return (
            <div className='mySlides' key={img.id}>
                <img src={img.image} alt='blogImg' />
            </div>
        )
    })

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
                if (slideIndex === num.length) buttons[1].style.display = 'none'
                else buttons[1].style.display = 'block'
                if (n < 1) slideIndex = 1
                if (slideIndex === 1) buttons[0].style.display = 'none'
                else buttons[0].style.display = 'block'
                for (let i = 0; i < num.length; i++) {
                    num[i].className = num[i].className.replace(' showSlide', '');
                }
                num[slideIndex - 1].className += ' showSlide'
            }
        };
    }, [])



    return (
        <>
            <div className='blog' >
                <div className='blogAuthor'>
                    <div className='d-flex align-items-center p-1'>
                        <div className='authorImg'>
                            {profile ?
                                <img src={profile} alt='author' />
                                :
                                <img src={userlogo} alt='author' />
                            }
                        </div>
                        {link ? <Link to={`/${author}`}>{author}</Link> : <p>{author}</p>}
                    </div>
                    {
                        setBlogs &&
                        <div className="phWxoR">
                            <input type="checkbox" id={`optionBlog${id}`} hidden />
                            <label htmlFor={`optionBlog${id}`} className="XsPzoY">
                                <span></span>
                                <span></span>
                                <span></span>
                            </label>
                            <div className="jWcoI">
                                <ul>
                                    <li onClick={() => DeletePost(id).then(() => setBlogs(prev => prev.filter(b => b.id !== id)))}>DELETE</li>
                                    <li><Link to={{ pathname: `/account/Blog-Option/`, state: { title, body, status, id, images } }}>EDIT</Link></li>
                                </ul>
                            </div>
                        </div>
                    }
                </div>
                <div className='blogInfo '>
                    {images.length > 1 &&
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
                    {images.length > 0 && images.length < 2 &&
                        <div className='blogimg'>
                            <div className="qxolps">
                                <img src={images[0].image} alt="blog" />
                            </div>
                        </div>
                    }
                    <div className='aboutBlog border-top'>
                        <h4 dir='auto'>{title}</h4>
                        <div className="Kbyci my-2">
                            <input id={`read-more-${id}`} type="checkbox" className="read-more__checkbox" hidden />
                            <p dir='auto'>{body}</p>
                            <label htmlFor={`read-more-${id}`} className="read-more__label" data-read-more="more..." data-read-less="less" aria-hidden="true"></label>
                        </div>
                        <div className="blogFooter border-top pt-2">
                            <div className="jcEzy d-flex align-items-center">
                                <div className="qxOpli">
                                    <span className='Ucrtl9_p'>{created.slice(0, 4) + ' / ' + created.slice(4, 6) + ' / ' + created.slice(6, 8)}</span>
                                </div>
                                <div className="post_action">
                                    <Like id={id} status_like={status_like} like={like} />
                                </div>
                            </div>
                            <div className="wZo8s">
                                {created !== updated && <span>edited</span>}
                                <Link to={{ pathname: `/posts/${id}/`, state: { from } }}>more...</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Blog;