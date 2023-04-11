import { useSelector } from 'react-redux'
import { selectAllUsers } from '../users/usersApiSlice'
import NewSessionForm from './NewSessionForm'

const NewSession = () => {
    const users = useSelector(selectAllUsers)

    console.log("users", users)

    // if (!users?.length) return <p>Not Currently Available</p>

    const content = <NewSessionForm users={users} />

    return content
}
export default NewSession