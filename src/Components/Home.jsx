import React, { useContext, useLayoutEffect, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './styles/main.css'
import Blog from './Blog';
import newUser from '../axios/newUser';
import Navbar from './Navbar';
import getPosts from '../axios/getPosts';



const Home = () => {
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    const history = useHistory()
    const [Posts, setPosts] = useState()
    const [blogs, setBlogs] = useState([])
    useEffect(() => {
        const get = async () => {
            setPosts(await getPosts(token))
        }
        get();
    }, [history])
    useEffect(() => {
        const SetHome = async () => {
            const user = await newUser(username, token)
            if (user !== null && Posts) {
                const myPost = filterByReference(Posts, user.following)
                setBlogs(user.post_set.concat(myPost))
            }
        }
        SetHome();
    }, [Posts])

    useLayoutEffect(() => {
        if (!token) history.push('/login')
    }, [token])

    const filterByReference = (arr1, arr2) => {
        let result = [];
        result = arr1.filter(el => {
            return arr2.find(element => {
                return element.following_user_id === el.author;
            });
        });
        return result;
    }

    const Blogs = blogs.length > 0 && blogs.map(i => {
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