import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './styles/main.css'
import Blog from './Blog';
import Navbar from './Navbar';
import getPosts from '../axios/getPosts';
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
        if (isFetching && Posts && !end) {
            fetchMoreListItems();
        }
    }, [isFetching, Posts]);

    async function fetchMoreListItems() {
        const post = await getPosts(Posts.length)
        await setPosts(prev => prev.concat(post.results))
        if (await post.next === null) setEnd(true)
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