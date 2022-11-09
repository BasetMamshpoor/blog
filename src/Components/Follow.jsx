import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import './styles/follow.css'
import userlogo from './images/Ei-user.svg'
import { getFollow } from '../axios/FollowRequest';

const Follow = () => {
    const history = useHistory();
    const List = useRef()
    const { state } = useLocation();
    const params = useParams()
    const [follow, setFollow] = useState()
    const [isFetching, setIsFetching] = useState(false)
    const [end, setEnd] = useState(false)

    useLayoutEffect(() => {
        if (!state) history.push(`/${params.user}`)
    }, [state, params])

    useEffect(() => {
        const get = async () => {
            const followUser = await getFollow(params.follow, state.id)
            await setFollow(followUser.results)
            if (await followUser.next === null) setEnd(!end)
        }
        get()
        List.current.addEventListener('scroll', handleScroll)
    }, [history])

    useEffect(() => {
        if (isFetching && follow && !end) {
            fetchMoreListItems();
        }
    }, [isFetching, follow]);

    function handleScroll() {
        if (List.current.scrollHeight - List.current.offsetHeight <= (List.current.scrollTop + 1)) {
            setIsFetching(true)
        }
    }

    async function fetchMoreListItems() {
        const followUser = await getFollow(params.follow, state.id, follow.length)
        if (await followUser.next === null) setEnd(true)
        await setFollow(prev => prev.concat(followUser.results))
        await setIsFetching(false)
    }

    const list = follow && follow.map(i => {
        if (params.follow === 'followers') {
            return (
                <li key={i.id}>
                    <div className="followImgProf">
                        <img src={userlogo} alt="" />
                    </div>
                    <Link to={`/${i.user}`} >{i.user}</Link>
                </li>
            )
        } else {
            return (
                <li key={i.id}>
                    <div className="followImgProf">
                        <img src={userlogo} alt="" />
                    </div>
                    <Link to={`/${i.following_user_id}`} >{i.following_user_id}</Link>
                </li>
            )
        }
    })

    return (
        <div className="container">
            <div className='wXFr'>
                <div className="lGop">
                    <header className="Bfou d-flex">
                        <p>{params.follow}</p>
                        <button onClick={() => history.goBack()}>X</button>
                    </header>
                    <ul className='FollowList' ref={List}>
                        {list}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Follow;