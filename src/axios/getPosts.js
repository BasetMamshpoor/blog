import axios from 'axios'
async function getPosts(offset = null, id = 0) {
    
    if (id > 0) {
        const get = await axios.get(`/posts/post/${id}`)
            .then(res => res.data)
            .catch(err => err.response.data)
        return get;
    }

    if (offset !== null) {
        
        const get = await axios.get(`/posts/post/?offset=${offset}`)
            .then(res => res.data)
        return get
    } else {

        const get = await axios.get('/posts/post/')
            .then(res => res.data)
            .catch(err => err.response.data)
        return get;
    }

}
export default getPosts;
