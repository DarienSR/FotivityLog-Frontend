import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../components/authentication/authSlice"
import jwtDecode from 'jwt-decode'

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isAdmin = false
    let status = "User"

    if (token) {
        const decoded = jwtDecode(token)

        const { username, roles , email, user_id } = decoded.UserInfo

        return { username, user_id, email}
    }

    return { username: '', roles: [], isAdmin, status }
}
export default useAuth