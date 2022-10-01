import axios from "axios"

async function newUser(userID, token) {

    const user = await axios.get(`accounts/users/${userID}`, { headers: { 'Authorization': `Token ${token}` } })
        .then(response => response.data )
        .catch(() => null )

    return user;
}
export default newUser