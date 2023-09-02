import { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSendLogoutMutation } from '../authentication/authApiSlice.js'
import useAuth from '../../hooks/useAuth.js'

import "../../App.css"
const Navbar = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const { username, email, user_id} = useAuth()

  const [sendLogout, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useSendLogoutMutation()

  useEffect(() => {
    if (isSuccess) navigate('/')
} , [isSuccess, navigate])


  return (
    <>
      <div style={ styles.navbar }>
        <div style={ styles.navbarHeader   }>
          <p style={styles.link}><Link className="logo" to="/">FotivityLog</Link></p>
        </div>

        <div style={ styles.navbarMain   }>
        {(username && email && user_id) ? 
          <>
            <p style={pathname === '/log/schedule' ? {...styles.link, ...styles.active} : {...styles.link}}><Link style={{textDecoration: 'none',color: "white"}} to="/log/schedule">Schedule</Link></p>
            {/* <p style={pathname === '/log/projects' ? {...styles.link, ...styles.active} : {...styles.link}}><Link style={{textDecoration: 'none',color: "white"}} to="/log/projects">Projects</Link></p> */}
            <p style={pathname === '/log/dashboard' ? {...styles.link, ...styles.active} : {...styles.link}}><Link style={{textDecoration: 'none',color: "white"}} to="/log/dashboard">Dashboard</Link></p>
            <p style={pathname === '/log/sessions' ? {...styles.link, ...styles.active} : {...styles.link}}><Link style={{textDecoration: 'none',color: "white"}}to="/log/sessions">Sessions</Link></p>
          </> : null
        }
        </div>

        <div style={ styles.navbarSide  }>
          {(username && email && user_id) ? 
          <>
            <p style={styles.link}><Link style={{textDecoration: 'none', color: "white"}} to="/log/user">{username}</Link></p>
            <p style={styles.link} onClick={sendLogout}>Logout</p>     
          </>
          :  <>
            <p style={styles.link}><Link style={{textDecoration: 'none',color: "white"}} to="/login">Login</Link></p> 
            <p style={styles.link}><Link style={{textDecoration: 'none',color: "white"}} to="/signup">Signup</Link></p> 
            
            </>
            }
        </div>
      </div>
    </>
  )
}


let styles = {
  navbar: {
    display: 'flex',
    height: '5rem',
    justifyContent: 'space-between',
    textAlign: 'center',
    position: 'fixed',
    top: '0%',
    width: '100%',
    backgroundColor: '#1e2124',
    color: 'white',
    zIndex: 100
  },
  navbarHeader: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '20%',
  },
  navbarMain: {
    display: 'flex',
    justifyContent: 'center',
    width: '60%',
  },
  navbarSide: {
    width: '20%',
    display: 'flex',
    justifyContent: 'space-around', 
  },
  link: {
    margin: '2rem',
    alignSelf: 'center',
    fontSize: '1.3rem',
    textDecoration: 'none',
    textUnderline: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    letterSpacing: '2px'
  },
  active: {
    borderBottom: "2px solid #aee6ff",
  }
}

export default Navbar