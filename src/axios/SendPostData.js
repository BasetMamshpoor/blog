import axios from "axios";

async function SendPostData(data, token) {
    const { title, body, uplouded_images, status } = data

    let formdata = new FormData();
    formdata.append("title", title);
    formdata.append("body", body);
    formdata.append("status", status);

    for (const img of uplouded_images) {
        formdata.append("uplouded_images", img);
    }

    await axios.post('/posts/post/', formdata, {
        headers:
        {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Token ${token}`
        }
    })
}
async function EditPost(data, token) {
    const { title, body, uplouded_images, status, id } = data

    let formdata = new FormData();
    formdata.append("title", title);
    formdata.append("body", body);
    formdata.append("status", status);

    for (const img of uplouded_images) {
        formdata.append("uplouded_images", img);
    }


    await axios.put(`/posts/post/${id}/`, formdata, {
        headers:
        {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Token ${token}`
        }
    })
}
export { EditPost };
export default SendPostData;
