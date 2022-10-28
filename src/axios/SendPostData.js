import axios from "axios";

async function SendPostData(data, token) {
    const { title, body, uplouded_images, status } = data
    const post = await axios.post('/posts/post/', {
        "title": title,
        "body": body,
        "uplouded_images": uplouded_images,
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
