import axios from 'axios';

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

async function sendComment(comment, id, token) {

    const response = axios.post('posts/comment/', { 'body': comment, 'post': id }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        }
    })

    return response;
}


export { sendComment };
export default getComment;