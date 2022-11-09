import axios from "axios"

async function newUser(userID, token, num = 0) {
    if (num) {
        const user = await axios.get(`accounts/users/${userID}/?page=${num}`, { headers: { 'Authorization': `Token ${token}` } })
            .then(response => response.data)
            .catch(() => null)

        return user;
    }

    const user = await axios.get(`accounts/users/${userID}`, { headers: { 'Authorization': `Token ${token}` } })

    return user;


}
export default newUser