import axios from "axios";

async function SendPostData(data, token) {

    const { title, body, picture, status } = data
    const post = await axios.post('/posts/post/', {
        "title": title,
        "body": body,
        "picture": picture,
        "status": status
    },
        {
            headers:
            {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Token ${token}`
            }
        })
    return post
}
export default SendPostData;
