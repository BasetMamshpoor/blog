import React, { useEffect, useRef } from 'react';
import './styles/blog.css';
import userlogo from './images/Ei-user.svg'
import { Link } from 'react-router-dom';



const Blog = ({ data, handleDeletePost, handleEditPost, from, link = true }) => {
    const { id, author, images, title, body, created } = data
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
        };
    }, [])


    return (
        <>
            <div className='blog' >
                <div className='blogAuthor'>
                    <div className='d-flex align-items-center'>
                        <div className='authorImg'>
                            <img src={userlogo} alt='author' width='60px' />
                        </div>
                        {link ? <Link to={`/users/${author}`}>{author}</Link> : <p>{author}</p>}
                    </div>
                    {
                        handleDeletePost &&
                        <div className="phWxoR">
                            <input type="checkbox" id={`optionBlog${id}`} hidden />
                            <label htmlFor={`optionBlog${id}`} className="XsPzoY">
                                <span></span>
                                <span></span>
                                <span></span>
                            </label>
                            <div className="jWcoI">
                                <ul>
                                    <li onClick={() => handleDeletePost(id)}>DELETE</li>
                                    <li onClick={() => handleEditPost(id)} hidden>EDIT</li>
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
                        <p dir='auto'>{body}</p>
                        <div className="blogFooter border-top">
                            <span>{created.slice(0, 4) + ' / ' + created.slice(4, 6) + ' / ' + created.slice(6, 8)}</span>
                            <Link to={{ pathname: `/posts/${id}`, state: { from } }}>more...</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Blog;