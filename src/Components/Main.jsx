import React, { useLayoutEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './styles/main.css'
import Blog from './Blog';
import Navbar from './Navbar';
import getPosts from '../axios/getPosts';
import { useEffect } from 'react';
import { useState } from 'react';



const Main = () => {
    const token = localStorage.getItem('token')
    const history = useHistory()
    const [Posts, setPosts] = useState()

    useEffect(() => {
        const get = async () => {
            const post = await getPosts(token)
            setPosts(post)
        }
        get()
    }, [history])

    useLayoutEffect(() => {
        if (!token) history.push('/login')
    }, [token])


    const Blogs = Posts && Posts.map(i => {
        return (
            <Blog
                key={i.id}
                author={i.author}
                picture={i.picture}
                title={i.title}
                body={i.body}
                created={i.created} />
        )
    })

    return (
        <>
            {Posts &&
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

export default Main;