import axios from 'axios';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import Blog from './Blog';
import Follow from './Follow'
import userlogo from './images/Ei-user.svg'
import './styles/userprofile.css'
import newUser from '../axios/newUser';

const UserProfile = () => {
    const token = localStorage.getItem('token')
    const myUsername = localStorage.getItem('username')
    const history = useHistory()
    const params = useParams()
    const userName = params.user
    const [user, setUser] = useState('')
    const [blogs, setBlogs] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const [end, setEnd] = useState(false)
    const isFollow = user && user.followers.find(u => u.user === myUsername)
    const me = (myUsername === userName) ? true : false


    useLayoutEffect(() => {
        if (!token) history.push('/login');
    }, [token, history])

    useEffect(() => {
        const findUser = async () => {
            const user = await newUser(userName, token)
            if (user === null) history.push('/usernotfound')
            else {
                await setUser(user)
                await setBlogs(user.post_set)
                if (await user.post_set.length < 1) setEnd(!end)
            }
        }
        findUser();
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll);
    }, [history, params])

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
        const user = await newUser(userName, token, Math.round(blogs.length / 5) + 1)
        if (await user.post_set.length < 1) setEnd(true)
        await setBlogs(prev => prev.concat(user.post_set))
        await setIsFetching(false)
    }

    const handleDeletePost = async (id) => {
        await axios.delete(`/posts/post/${id}`, { headers: { 'Authorization': `Token ${token}` } })
            .then(() => setBlogs(blogs.filter(b => b.id !== id)))
    }

    const handleEditPost = async (id) => {
        // await axios.put(`posts/post/${id}`, {
        //     "title": "30",
        //     "body": "body",
        //     "picture": null,
        //     "status": "PU"
        // },
        //     {
        //         headers:
        //         {
        //             'Content-Type': 'multipart/form-data',
        //             'Authorization': `Token ${token}`
        //         }
        //     })
        //     .then(res => console.log(res))
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
                    handleEditPost={handleEditPost}
                    link={false}
                />
            )
        }
    })

    const handleFollow = async () => {
        if (isFollow) {
            await axios.delete(`/accounts/following/${isFollow.id}`, { headers: { 'Authorization': `Token ${token}` } })
                .then(async () => setUser(await newUser(userName, token)))
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
                .then(async () => setUser(await newUser(userName, token)))
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        history.push('/login')
    }

    return (
        <>
            {
                <div className='container'>
                    {params.follow === 'followers' && <Follow type={'Followers'} id={user.id} />}
                    {params.follow === 'following' && <Follow type={'Following'} id={user.id} />}

                    <div className="row justify-content-between">
                        <div className="col-4">
                            <div className="prVk">
                                <header className="gCte d-flex my-3">
                                    <div className="nmU">
                                        <img src={userlogo} alt="" />
                                    </div>
                                    <h3>{user && user.username}</h3>
                                </header>
                                <div className="mUyf d-flex">
                                    <Link to={`/users/${userName}/followers`} className="mgVj">
                                        <span>{user && user.followers.length}</span>
                                        <p>followers</p>
                                    </Link>
                                    <Link to={`/users/${userName}/following`} className="mgVj">
                                        <span>{user && user.following.length}</span>
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
                        </div>
                        <div className="col-8">
                            {Blogs.length ? Blogs : <p>no post</p>}
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default UserProfile;