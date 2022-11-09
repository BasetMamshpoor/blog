import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import notify from '../Auth/toast'
import loading from './images/200.gif'
import getComment, { sendComment } from '../axios/Comment';

const Comment = ({ token, id }) => {
    const [Comments, setComments] = useState([])
    const [comment, setComment] = useState('')
    const [render, setRender] = useState(0)
    const [isFetching, setIsFetching] = useState(false)
    const [end, setEnd] = useState(false)

    useEffect(() => {
        const get = async () => {
            const comment = await getComment(null, id)
            await setComments(comment)
            if (await comment.next === null) setEnd(!end)
        }
        get()
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll);
    }, [render])

    useEffect(() => {
        if (isFetching && Comments.results && !end) {
            fetchMoreListItems();
        }
    }, [isFetching, Comments]);

    async function fetchMoreListItems() {
        const comment = await getComment(Comments.results.length, id)
        await setComments(prev => prev.results.concat(comment.results))
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
            await sendComment(comment, id, token).then(() => {
                setRender(Math.random())
                setComment('')
            })
        }
    }

    const comments = Comments.results && Comments.results.map(c => {
        return (
            <div className="comment" key={c.id}>
                <div className="headerC">
                    <Link to={`/${c.owner}`}>{c.owner}</Link>
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
                <h5>comments - {Comments.count}</h5>
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