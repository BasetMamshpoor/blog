import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './styles/main.css'
import Blog from './Blog';
import loading from './images/200.gif'
import fetchData from '../axios/getPosts'
import axios from 'axios'

const Main = ({ type }) => {
    const token = localStorage.getItem('token')
    const history = useHistory()
    const [Posts, setPosts] = useState()
    const [isFetching, setIsFetching] = useState(false)
    const [end, setEnd] = useState(false)
    useLayoutEffect(() => {
        if (type === 'post' && !token) history.push('/login')
    }, [token])


    useEffect(() => {
        const get = async () => {
            if (token) {
                const post = await fetchData(token, type);
                setPosts(post.results)
                if (post.next === null) setEnd(true)
            } else {
                const post = await fetchData(null, type);
                setPosts(post.results)
                if (post.next === null) setEnd(true)
            }
        }
        get()
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll);
    }, [history])

    useEffect(() => {
        if (isFetching && Posts && !end) {
            fetchMoreListItems();
        }
    }, [isFetching, Posts]);

    async function fetchMoreListItems() {
        const post = await fetchData(token, type, Posts.length)
        await setPosts(prev => prev.concat(post.results))
        if (await post.next === null) setEnd(true)
        await setIsFetching(false);
    }

    function handleScroll() {
        if ((document.scrollingElement.scrollHeight - window.innerHeight) <= (document.documentElement.scrollTop.toFixed())) {
            setIsFetching(true);
        }
    }

    const Blogs = Posts && Posts.map(item => {
        return (
            <Blog
                key={item.id}
                from={type}
                data={item} />
        )
    })

    return (
        <>
            {Posts &&
                <div className='main'>
                    <div className='container'>
                        <main className='blogs d-flex flex-column'>
                            {Blogs}
                        </main>
                        {isFetching && !end && <div className='loading'><img src={loading} alt='loading' /></div>}
                    </div>
                </div>
            }
        </>
    );
};

export default Main;