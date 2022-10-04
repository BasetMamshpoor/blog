import React from 'react';
import './styles/blog.css';
import userlogo from './images/Ei-user.svg'
import { Link } from 'react-router-dom';



const Blog = ({ author, picture, title, body, created, link = true }) => {
    return (
        <div className='blog' >
            <div className='blogAuthor'>
                <div className='authorImg'>
                    <img src={userlogo} alt='author' width='60px' />
                </div>
                {link ? <Link to={`/users/${author}`}>{author}</Link> : <p>{author}</p>}
            </div>
            <div className='blogInfo'>
                <div className='blogImg'>
                    {picture && <img src={picture} alt='blog' />}
                </div>
                <div className='aboutBlog'>
                    <h4 dir='auto'>{title}</h4>
                    <p dir='auto'>{body}</p>
                    <div className="blogFooter">
                        <span>{created}</span>
                        <a href="">more...</a>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Blog;