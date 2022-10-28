import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles/navbar.css'
const Navbar = () => {
    const username = localStorage.getItem('username')
    const token = localStorage.getItem('token')
    const location = useLocation()

    if (location.pathname === '/login' || location.pathname === '/signin') {
        return null
    }

    return (
        <>
            <section className="XaOp py-4 sticky-top bg-white">
                <div className="container">
                    <nav className='navBar'>
                        <ul className="d-flex ">
                            {token && <><li><Link to='/'>Home</Link></li>
                                <li><Link to={`/${username}/addblog`}>Add Post</Link></li></>}
                            <li><Link to='/explore'>Explore</Link></li>
                            <li><Link to={token ? `/users/${username}` : '/login'}>{token ? "Profile" : 'Log in'}</Link></li>
                        </ul>
                    </nav>
                </div>
            </section>
        </>
    );
};

export default Navbar;