import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './styles/main.css'
import Blog from './Blog';
import Navbar from './Navbar';
import getPosts from '../axios/getPosts';
import { useState } from 'react';
import axios from 'axios';
import loading from './images/200.gif'


const Main = () => {
    const history = useHistory()
    const [Posts, setPosts] = useState()
    const [isFetching, setIsFetching] = useState(false)
    const [end, setEnd] = useState(false)

    useEffect(() => {
        const get = async () => {
            const post = await getPosts();
            setPosts(post)
        }
        get()
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll);
    }, [history])

    useEffect(() => {
        console.log(1);
        if (isFetching && Posts && !end) {
            fetchMoreListItems();
        }
    }, [isFetching, Posts]);

    async function fetchMoreListItems() {
        await axios.get(`/posts/post/?offset=${Posts.length}`)
            .then(res => {
                setPosts(prev => prev.concat(res.data.results))
                if (res.data.next == null) setEnd(true)
            })
        await setIsFetching(false);
    }

    function handleScroll() {
        if ((document.scrollingElement.scrollHeight - window.innerHeight) <= (document.documentElement.scrollTop.toFixed())) {
            setIsFetching(true);
        }
    }

    const Blogs = Posts && Posts.map(i => {
        return (
            <Blog
                key={i.id}
                id={i.id}
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
                        {isFetching && !end && <div className='loading'><img src={loading} alt='loading' /></div>}
                    </div>
                </div>
            }
        </>
    );
};

export default Main;