import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import './styles/follow.css'

const Follow = ({ type, users }) => {
    const history = useHistory();
    const list = users && users.map(i => {
        if (type === 'Followers') {
            return (
                <li key={i.id}><Link to={`/users/${i.user}`} >{i.user}</Link></li>
            )
        } else {
            return (
                <li key={i.id}><Link to={`/users/${i.following_user_id}`} >{i.following_user_id}</Link></li>
            )
        }
    })
    return (
        <div className='wXFr'>
            <div className="lGop">
                <header className="Bfou d-flex">
                    <p>{type}</p>
                    <button onClick={() => history.goBack()}>X</button>
                </header>
                <ul>
                    {list}
                </ul>
            </div>
        </div>
    );
};

export default Follow;