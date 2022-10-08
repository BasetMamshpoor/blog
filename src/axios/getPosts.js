import axios from 'axios'
async function getPosts(id = 0) {
    if (id > 0) {
        const get = await axios.get(`/posts/post/${id}`)
            .then(res => res.data)
            .catch(err => err.response.data)
        return get;
    } else {
        const get = await axios.get('/posts/post/')
            .then(res => res.data.results)
            .catch(err => err.response.data)
        return get;
    }
}
export default getPosts;
