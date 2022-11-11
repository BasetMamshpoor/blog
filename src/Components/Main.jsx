import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './styles/main.css'
import Blog from './Blog';
import loading from './images/200.gif'
import getPost from '../axios/getPost'
import { ToastContainer } from 'react-toastify';


const Main = ({ type }) => {
    const token = localStorage.getItem('token')
    const history = useHistory()
    const [blogs, setBlogs] = useState()
    const [isFetching, setIsFetching] = useState(false)
    const [end, setEnd] = useState(false)
    useLayoutEffect(() => {
        if (type === 'post' && !token) history.push('/explore')
    }, [token])

    useEffect(() => {
        const get = async () => {
            const post = await getPost(token, type);
            setBlogs(post.results)
            if (post.next === null) setEnd(true)
            else setEnd(false)
        }
        get()
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll);
    }, [history])

    useEffect(() => {
        if (isFetching && blogs && !end) {
            fetchMoreListItems();
        }
    }, [isFetching, blogs]);

    async function fetchMoreListItems() {
        const post = await getPost(token, type, blogs.length)
        await setBlogs(prev => prev.concat(post.results))
        if (await post.next === null) setEnd(true)
        await setIsFetching(false);
    }

    function handleScroll() {
        if ((document.scrollingElement.scrollHeight - window.innerHeight) <= (document.documentElement.scrollTop.toFixed())) {
            setIsFetching(true);
        }
    }

    const Blogs = blogs && blogs.map(item => {
        if (item.author === localStorage.getItem('username')) {
            return (
                <Blog
                    key={item.id}
                    data={item}
                    setBlogs={setBlogs}
                    from={type}
                    link={true}
                />
            )
        } else {
            return (
                <Blog
                    key={item.id}
                    data={item}
                    link={true}
                    from={type}
                />
            )
        }
    })

    return (
        <>
            {blogs &&
                <div className='main'>
                    <div className='container'>
                        <main className='blogs d-flex flex-column'>
                            {Blogs}
                        </main>
                        {isFetching && !end && <div className='loading'><img src={loading} alt='loading' /></div>}
                    </div>
                    <ToastContainer />
                </div>
            }
        </>
    );
};

export default Main;