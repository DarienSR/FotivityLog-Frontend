import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../components/authentication/authSlice"
import jwtDecode from 'jwt-decode'

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isAdmin = false
    let status = "User"

    if (token) {
        const decoded = jwtDecode(token)

        const { username, roles, email, id } = decoded.UserInfo

        isAdmin = roles.includes('Admin')

        if (isAdmin) status = "Admin"

        return { username, id, isAdmin, email}
    }

    return { username: '', roles: [], isAdmin, status }
}
export default useAuth