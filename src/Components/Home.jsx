import React, { useLayoutEffect, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './styles/main.css'
import Blog from './Blog';
import newUser from '../axios/newUser';
import Navbar from './Navbar';
import getPosts from '../axios/getPosts';
import axios from 'axios';



const Home = () => {
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    const history = useHistory()
    const [user, setUser] = useState()
    const [blogs, setBlogs] = useState([])

    useEffect(() => {
        const SetHome = async () => {
            const thisUser = await newUser(username, token)
            await setUser(thisUser)
            await setBlogs(thisUser.post_set)
        }
        SetHome();
    }, [])

    useEffect(() => {
        if (user) {
            user.following.map(async f => {
                const followingPost = await axios.get(`accounts/users/${f.following_user_id}`)
                    .then(res => res.data.post_set)
                await setBlogs(prev => prev.concat(followingPost))
            })
        }
    }, [user])


    useLayoutEffect(() => {
        if (!token) history.push('/login')
    }, [token])

    const Blogs = blogs.length > 0 && blogs.map(item => {
        return (
            <Blog
                key={item.id}
                data={item} />
        )
    })

    return (
        <>
            {blogs &&
                <div className='main'>
                    <Navbar />
                    <div className='container'>
                        <main className='blogs d-flex flex-column'>
                            {Blogs}
                        </main>
                    </div>
                </div>
            }
        </>
    );
};

export default Home;