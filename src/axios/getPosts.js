import axios from "axios";

async function fetchData(token, path = 'post', offset = null, id = 0) {
    if (id > 0) {
        const get = await axios.get(`/posts/explore/${id}`)
            .then(res => res.data)
            .catch(err => err.response.data)
        return get;
    }
    if (token !== null) {
        if (offset !== null) {
            const get = await axios.get(`/posts/${path}/?offset=${offset}`, { headers: { 'Authorization': `Token ${token}` } })
                .then(res => res.data)
                .catch(err => err.response.data)
            return get;
        } else {
            const get = await axios.get(`/posts/${path}/`, { headers: { 'Authorization': `Token ${token}` } })
                .then(res => res.data)
                .catch(err => err.response.data)
            return get;
        }
    } else {
        if (offset !== null) {
            const get = await axios.get(`/posts/${path}/?offset=${offset}`)
                .then(res => res.data)
                .catch(err => err.response.data)
            return get;
        } else {
            const get = await axios.get(`/posts/${path}/`)
                .then(res => res.data)
                .catch(err => err.response.data)
            return get;
        }
    }
}
export default fetchData;