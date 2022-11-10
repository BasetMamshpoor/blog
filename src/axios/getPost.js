import axios from "axios";


async function getPost(token, path = 'post', offset, id) {

    if (token) {
        if (offset) {
            const get = await axios.get(`/posts/${path}/?offset=${offset}`, { headers: { 'Authorization': `Token ${token}` } })
                .then(res => res.data)
                .catch(err => err.response.data)
            return get;
        } else {
            if (id > 0) {
                const get = await axios.get(`/posts/${path}/${id}/`, { headers: { 'Authorization': `Token ${token}` } })
                    .then(res => res.data)
                    .catch(err => err.response.data)
                return get;
            }
            const get = await axios.get(`/posts/${path}/`, { headers: { 'Authorization': `Token ${token}` } })
                .then(res => res.data)
                .catch(err => err.response.data)
            return get;
        }
    } else {
        if (offset) {
            const get = await axios.get(`/posts/explore/?offset=${offset}`)
                .then(res => res.data)
                .catch(err => err.response.data)
            return get;
        } else {
            if (id > 0) {
                const get = await axios.get(`/posts/explore/${id}/`)
                    .then(res => res.data)
                    .catch(err => err.response.data)
                return get;
            }
            const get = await axios.get(`/posts/explore/`)
                .then(res => res.data)
                .catch(err => err.response.data)
            return get;
        }
    }

}

export default getPost;
