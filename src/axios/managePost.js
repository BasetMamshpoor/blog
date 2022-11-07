import axios from 'axios';

const token = localStorage.getItem('token')

async function EditPost(data) {
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
async function DeletePost(id) {
    const req = await axios
        .delete(`/posts/post/${id}`, { headers: { 'Authorization': `Token ${token}` } })
    return req;
}
export { EditPost, DeletePost };