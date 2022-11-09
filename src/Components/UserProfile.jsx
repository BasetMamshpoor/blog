import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useHistory, useParams, Link, } from 'react-router-dom';
import Blog from './Blog';
import userlogo from './images/Ei-user.svg'
import Loading from './images/200.gif'
import './styles/userprofile.css'
import newUser from '../axios/newUser';
import FollowRequest from '../axios/FollowRequest';
import UserNotFound from './NotFound/UserNotFound.jsx'

const UserProfile = () => {
    const token = localStorage.getItem('token')
    const myUsername = localStorage.getItem('username')
    const history = useHistory()
    const params = useParams()
    const userName = params.user
    const [user, setUser] = useState('')
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
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
                await newUser(userName, token).then(({ data }) => {
                    setLoading(false)
                    setUser(data)
                    setBlogs(data.post_set)
                    if (data.post_set.length < 1) setEnd(!end)
                }).catch(() => {
                    setLoading(false)
                    setUser(false)
                })
            }
            findUser();
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll);
    }, [params, render])

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
                    setBlogs={setBlogs}
                    link={false}
                />
            )
        }
    })

    const handleFollow = async () => {
        await FollowRequest(user.status_follow, user.username, token).then(() => setRender(Math.random()))
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        history.push('/explore')
    }

    return (
        <>
            <div className='container'>
                <div className="row justify-content-center">
                    {loading ? <img src={Loading} alt="" style={{ width: '200px', height: '200px', objectFit: 'cover', }} /> : user ?
                        <>
                            <div className="col-4">
                                <div className="prVk sticky-top">
                                    <header className="gCte d-flex my-3">
                                        <div className="nmU">
                                            {user.profile_photo ?
                                                <img src={user.profile_photo} alt="" />
                                                :
                                                <img src={userlogo} alt="" />
                                            }
                                        </div>
                                        <h3>{user.username}</h3>
                                    </header>
                                    <div className="mUyf d-flex">
                                        <Link to={{ pathname: `/${userName}/followers`, state: { id: user.id } }} className="mgVj">
                                            <span>{user.followers}</span>
                                            <p>followers</p>
                                        </Link>
                                        <Link to={{ pathname: `/${userName}/following`, state: { id: user.id } }} className="mgVj">
                                            <span>{user.following}</span>
                                            <p>following</p>
                                        </Link>
                                    </div>
                                    <div className="gBqr">
                                        <ul>
                                            <li><span>FirstName:</span> {user.first_name}</li>
                                            <li><span>LastName:</span> {user.last_name}</li>
                                            <li><span>Email:</span> {user.email}</li>
                                        </ul>
                                    </div>
                                    <div className="bOOb">
                                        {
                                            me ?
                                                <>
                                                    <Link to={{ pathname: `/${user.username}/edit-profile`, state: user }}>Edit Profile</Link>
                                                    <button onClick={() => handleLogout()}>Log out</button>
                                                </>
                                                :
                                                <>
                                                    <button onClick={() => handleFollow()}>{user.status_follow ? 'unFollow' : 'follow'}</button>
                                                    <button disabled>message</button>
                                                </>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-8">
                                <div className="gBcymj">
                                    {Blogs.length ? Blogs : <p>no post</p>}
                                </div>
                                {isFetching && !end && <div className='loading'><img src={Loading} alt='loading' /></div>}
                            </div>
                        </>
                        : <UserNotFound />
                    }
                </div>
            </div>
        </>
    );
};

export default UserProfile;