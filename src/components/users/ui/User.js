import "../../../App.css"
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth.js'
const User = () => {
  const { username, email, id} = useAuth()
  return (
    <div className="fotivity-container">
      <p><Link style={{textDecoration: 'none', color: "black"}} to={`/log/user/edit/${id}`}>Change User Information</Link></p>
    </div>
  )
}
export default User