import axios from 'axios'
async function getPosts(token) {
    const get = await axios.get('/posts/post/', { headers: { 'Authorization': `Token ${token}` } })
        .then(res => res.data.results)
        .catch(err => err.response.data)
    return get;
}
export default getPosts;
