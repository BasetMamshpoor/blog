import axios from 'axios';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useHistory, useParams, Link, } from 'react-router-dom';
import Blog from './Blog';
import userlogo from './images/Ei-user.svg'
import loading from './images/200.gif'
import './styles/userprofile.css'
import newUser from '../axios/newUser';

const isFollowers = async (id, user) => {
    const token = localStorage.getItem('token')
    const get = await axios.get(`/accounts/following/${id}/${user}`, { headers: { 'Authorization': `Token ${token}` } })
        .then(() => true)
        .catch(() => false)

    return get;
}

const UserProfile = () => {
    const token = localStorage.getItem('token')
    const myUsername = localStorage.getItem('username')
    const history = useHistory()
    const params = useParams()
    const userName = params.user
    const [user, setUser] = useState('')
    const [blogs, setBlogs] = useState([])
    const [isFollow, setIsFollow] = useState(false)
    const [render, setRender] = useState(0)
    const [isFetching, setIsFetching] = useState(false)
    const [end, setEnd] = useState(false)
    const me = (myUsername === userName) ? true : false


    useLayoutEffect(() => {
        if (token === null)
            history.push('/login');
    }, [history, token])

    useEffect(() => {
        if (token) {
            const findUser = async () => {
                const user = await newUser(userName, token)
                if (await user === null) history.push('/usernotfound')
                else {
                    await setUser(user)
                    await setBlogs(user.post_set)
                    if (await user.post_set.length < 1) setEnd(!end)
                    if (!me) setIsFollow(await isFollowers(user.id, userName));
                }
            }
            findUser();
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll);
    }, [history, params, render])

    useEffect(() => {
        if (isFetching && blogs && !end) {
            fetchMoreListItems();
        }
    }, [isFetching, blogs]);

    function handleScroll() {
        if ((document.scrollingElement.scrollHeight - window.innerHeight) <= (document.documentElement.scrollTop.toFixed())) {
            setIsFetching(true);
        }
    }

    async function fetchMoreListItems() {
        const user = await newUser(userName, token, Math.ceil(blogs.length / 5) + 1)
        if (await user.post_set.length < 1) setEnd(!end)
        await setBlogs(prev => prev.concat(user.post_set))
        await setIsFetching(false)
    }

    const handleDeletePost = async (id) => {
        await axios.delete(`/posts/post/${id}`, { headers: { 'Authorization': `Token ${token}` } })
            .then(() => setBlogs(blogs.filter(b => b.id !== id)))
    }

    const Blogs = blogs && blogs.map(item => {
        if (!me) {
            return (
                <Blog
                    key={item.id}
                    data={item}
                    link={false}
                />
            )
        } else {
            return (
                <Blog
                    key={item.id}
                    data={item}
                    handleDeletePost={handleDeletePost}
                    // handleEditPost={handleEditPost}
                    link={false}
                />
            )
        }
    })

    const handleFollow = async () => {
        if (isFollow) {
            await axios.delete(`/accounts/following/${isFollow.id}`, { headers: { 'Authorization': `Token ${token}` } })
                .then(() => setRender(Math.random()))
        } else {
            await axios.post('/accounts/following/',
                { "following_user_id": user.username },
                {
                    headers:
                    {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    }
                })
                .then(() => setRender(Math.random()))
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        history.push('/login')
    }

    return (
        <>
            <div className='container'>
                <div className="row justify-content-between">
                    <div className="col-4">
                        {user ?
                            <div className="prVk sticky-top">
                                <header className="gCte d-flex my-3">
                                    <div className="nmU">
                                        {user.profile.photo ?
                                            <img src={user.profile.photo} alt="" />
                                            :
                                            <img src={userlogo} alt="" />
                                        }
                                    </div>
                                    <h3>{user && user.username}</h3>
                                </header>
                                <div className="mUyf d-flex">
                                    <Link to={{ pathname: `/users/${userName}/followers`, state: { id: user.id } }} className="mgVj">
                                        <span>{user && user.followers}</span>
                                        <p>followers</p>
                                    </Link>
                                    <Link to={{ pathname: `/users/${userName}/followers`, state: { id: user.id } }} className="mgVj">
                                        <span>{user && user.following}</span>
                                        <p>following</p>
                                    </Link>
                                </div>
                                <div className="gBqr">
                                    <ul>
                                        <li><span>FirstName:</span> {user && user.first_name}</li>
                                        <li><span>LastName:</span> {user && user.last_name}</li>
                                        <li><span>Email:</span> {user && user.email}</li>
                                    </ul>
                                </div>
                                <div className="bOOb">
                                    {
                                        me ?
                                            <>
                                                <button disabled>Edit Profile</button>
                                                <button onClick={() => handleLogout()}>Log out</button>
                                            </>
                                            :
                                            <>
                                                <button onClick={() => handleFollow()}>{isFollow ? 'unFollow' : 'follow'}</button>
                                                <button disabled>message</button>
                                            </>
                                    }
                                </div>
                            </div>
                            : <div className='loading'><img src={loading} alt='loading' /></div>
                        }
                    </div>
                    <div className="col-8">
                        <div className="gBcymj">
                            {Blogs.length ? Blogs : <p>no post</p>}
                        </div>
                        {isFetching && !end && <div className='loading'><img src={loading} alt='loading' /></div>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserProfile;