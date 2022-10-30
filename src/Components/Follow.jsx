import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './styles/follow.css'

const getFollow = async (type, id, offset = null) => {
    const token = localStorage.getItem('token')
    if (offset === null) {
        const get = await axios.get(`/accounts/following/${id}/${type}`, { headers: { 'Authorization': `Token ${token}` } })
            .then(res => res.data)
            .catch(err => err.response.data)
        return get;
    } else {
        const get = await axios
            .get(`/accounts/following/${id}/${type}/?offset=${offset}`, { headers: { 'Authorization': `Token ${token}` } })
            .then(res => res.data)
            .catch(err => err.response.data)
        return get;
    }
}

const Follow = ({ type, id }) => {
    const history = useHistory();
    const List = useRef()
    const [follow, setFollow] = useState()
    const [isFetching, setIsFetching] = useState(false)
    const [end, setEnd] = useState(false)


    useEffect(() => {
        const get = async () => {
            const follow = await getFollow(type, id)
            await setFollow(follow.results)
            if (await follow.next === null) setEnd(!end)
        }
        get()
        List.current.addEventListener('scroll', handleScroll)
        return () => List.current.removeEventListener('scroll', handleScroll);
    }, [history])

    useEffect(() => {
        if (isFetching && follow && !end) {
            fetchMoreListItems();
        }
    }, [isFetching, follow]);

    function handleScroll(e) {
        if ((document.scrollingElement.scrollHeight - window.innerHeight) <= (document.documentElement.scrollTop.toFixed())) {
            setIsFetching(true);
            console.log('end');
        }
    }

    async function fetchMoreListItems() {
        // const user = await newUser(userName, token, Math.round(blogs.length / 5) + 1)
        // if (await user.post_set.length < 1) setEnd(true)
        // await setBlogs(prev => prev.concat(user.post_set))
        // await setIsFetching(false)
    }


    const list = follow && follow.map(i => {
        // if (type === 'Followers') {
        return (
            <li key={i.id}><Link to={`/users/${i.user}`} >{i.user}</Link></li>
        )
        // } else {
        // return (
        //     <li key={i.id}><Link to={`/users/${i.user}`} >{i.user}</Link></li>
        // )
        // }
    })


    return (
        <div className='wXFr'>
            <div className="lGop">
                <header className="Bfou d-flex">
                    <p>{type}</p>
                    <button onClick={() => history.goBack()}>X</button>
                </header>
                <ul className='FollowList' ref={List}>
                    {list}
                    {list}
                    {list}
                    {list}
                </ul>
            </div>
        </div>
    );
};

export default Follow;