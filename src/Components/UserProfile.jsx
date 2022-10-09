import axios from 'axios';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import Blog from './Blog';
import Follow from './Follow'
import userlogo from './images/Ei-user.svg'
import './styles/userprofile.css'
import newUser from '../axios/newUser';
import Navbar from './Navbar';

const UserProfile = () => {
    const token = localStorage.getItem('token')
    const myUsername = localStorage.getItem('username')
    const history = useHistory()
    const params = useParams()
    const userName = params.user
    const [user, setUser] = useState('')
    const [blogs, setBlogs] = useState([])
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
                setUser(user)
                setBlogs(user.post_set)
            }
        }
        findUser();
    }, [history, params])

    const Blogs = blogs && blogs.map(i => {
        return (
            <Blog
                key={i.id}
                id={i.id}
                author={i.author}
                picture={i.picture}
                title={i.title}
                body={i.body}
                created={i.created}
                prof={true} />
        )
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
                    <Navbar />
                    {params.follow === 'followers' && <Follow type={'Followers'} users={user.followers} />}
                    {params.follow === 'following' && <Follow type={'Following'} users={user.following} />}

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