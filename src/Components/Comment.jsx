import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import notify from '../Auth/toast'
import loading from './images/200.gif'


const getComment = async (offset = null, id) => {
    if (offset !== null) {
        const get = await axios.get(`/posts/comment/${id}/post_id/?offset=${offset}`)
            .then(res => res.data)
            .catch(err => console.log(err.response.data))
        return get;
    }
    const get = await axios.get(`/posts/comment/${id}/post_id`)
        .then(res => res.data)
        .catch(err => console.log(err.response.data))
    return get;
}

const Comment = ({ token, id }) => {
    const [Comments, setComments] = useState()
    const [comment, setComment] = useState('')
    const [render, setRender] = useState(0)
    const [isFetching, setIsFetching] = useState(false)
    const [end, setEnd] = useState(false)

    useEffect(() => {
        const get = async () => {
            const comment = await getComment(null, id)
            await setComments(comment.results)
            if (await comment.next === null) setEnd(!end)
        }
        get()
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll);
    }, [render])

    useEffect(() => {
        if (isFetching && Comments && !end) {
            fetchMoreListItems();
        }
    }, [isFetching, Comments]);

    async function fetchMoreListItems() {
        const comment = await getComment(Comments.length, id)
        await setComments(prev => prev.concat(comment.results))
        if (await comment.next === null) setEnd(true)
        await setIsFetching(false)
    }

    function handleScroll() {
        if ((document.scrollingElement.scrollHeight - window.innerHeight) <= (document.documentElement.scrollTop.toFixed())) {
            setIsFetching(true);
        }
    }

    const handleComment = async (e) => {
        e.preventDefault()
        if (!token) notify('error', 'Please Login')
        else if (comment.trim()) {
            await axios.post('posts/comment/', { 'body': comment, 'post': id }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            })
                .then(() => {
                    setRender(Math.random())
                    setComment('')
                })
        }
    }

    const comments = Comments && Comments.map(c => {
        return (
            <div className="comment" key={c.id}>
                <div className="headerC">
                    <Link to={`/users/${c.owner}`}>{c.owner}</Link>
                </div>
                <div className="bodyC">
                    <p>{c.body}</p>
                </div>
                <div className="csxop">
                    <span className='me-3'>{c.created.slice(0, 4) + ' / ' + c.created.slice(4, 6) + ' / ' + c.created.slice(6, 8)}</span>
                    <span>{c.created.slice(8, 10) + ' : ' + c.created.slice(10, 12)}</span>
                </div>
            </div>
        )
    })

    return (
        <>
            <div className="postComment">
                <h5>comments</h5>
                <div className="commentForm">
                    <form encType='multipart/form-data'>
                        <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} />
                        <button onClick={handleComment}>Send</button>
                    </form>
                </div>
                <div className="commentList">
                    {comments}
                </div>
                {isFetching && !end && <div className='loadingComment'><img src={loading} alt='loading' /></div>}
            </div>
        </>
    );
};

export default Comment;