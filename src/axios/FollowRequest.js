import axios from "axios";

async function FollowRequest(status_follow, username, token) {
    if (status_follow) {
        const response = await axios.delete(`/accounts/following/${status_follow}`, { headers: { 'Authorization': `Token ${token}` } })

        return response;
    } else {
        const response = await axios.post('/accounts/following/',
            { "following_user_id": username },
            {
                headers:
                {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            })
        return response;
    }
}
const getFollow = async (type, id, offset = null) => {
    if (offset === null) {
        const get = await axios.get(`/accounts/following/${id}/${type}`)
            .then(res => res.data)
            .catch(err => err.response.data)
        return get;
    } else {
        const get = await axios
            .get(`/accounts/following/${id}/${type}/?offset=${offset}`)
            .then(res => res.data)
            .catch(err => err.response.data)
        return get;
    }
}
export { getFollow };
export default FollowRequest;