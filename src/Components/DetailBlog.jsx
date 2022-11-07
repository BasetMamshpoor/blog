import React, { useRef, useEffect } from 'react';
import userlogo from './images/Ei-user.svg'
import { Link } from 'react-router-dom';
import Comment from './Comment.jsx'

const DetailBlog = ({ post, token }) => {
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
                    <div className='authorImg'>
                        {post.profile ?
                                <img src={post.profile} alt='author' />
                                :
                                <img src={userlogo} alt='author' />
                            }
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
                <Comment token={token} id={post.id} />
            </div>
        </>
    );
};

export default DetailBlog;