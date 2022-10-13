import React from 'react';
import { Link } from 'react-router-dom';
import './styles/navbar.css'
const Navbar = () => {
    const username = localStorage.getItem('username')
    return (
        <>
            <section className="XaOp py-5">
                <div className="container">
                    <nav className='navBar'>
                        <ul className="d-flex ">
                            <li><Link to='/blog'>Home</Link></li>
                            <li><Link to={`/${username}/addblog`}>Add Post</Link></li>
                            <li><Link to='/'>Explore</Link></li>
                            <li><Link to={`/users/${username}`}>Profile</Link></li>
                        </ul>
                    </nav>
                </div>
            </section>
        </>
    );
};

export default Navbar;