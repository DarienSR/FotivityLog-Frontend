import { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSendLogoutMutation } from '../authentication/authApiSlice.js'
import useAuth from '../../hooks/useAuth.js'

import "../../App.css"
const Navbar = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const { username, email, user_id} = useAuth()
  console.log(pathname)
  if(pathname === '/dashboard') console.log("highlight dashboard")

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
            <p style={pathname === '/log/schedule' ? {...styles.link, ...styles.active} : {...styles.link}}><Link style={{textDecoration: 'none',color: "black"}} to="/log/schedule">Schedule</Link></p>
            <p style={pathname === '/log/projects' ? {...styles.link, ...styles.active} : {...styles.link}}><Link style={{textDecoration: 'none',color: "black"}} to="/log/projects">Projects</Link></p>
            <p style={pathname === '/log/dashboard' ? {...styles.link, ...styles.active} : {...styles.link}}><Link style={{textDecoration: 'none',color: "black"}} to="/log/dashboard">Dashboard</Link></p>
            <p style={pathname === '/log/sessions' ? {...styles.link, ...styles.active} : {...styles.link}}><Link style={{textDecoration: 'none',color: "black"}}to="/log/sessions">Sessions</Link></p>
          </> : null
        }
        </div>

        <div style={ styles.navbarSide  }>
          {(username && email && user_id) ? 
          <>
            <p style={styles.link}><Link style={{textDecoration: 'none', color: "black"}} to="/log/user">{username}</Link></p>
            <button style={styles.link} onClick={sendLogout}>Logout</button>     
          </>
          :  <>
            <p style={styles.link}><Link style={{textDecoration: 'none',color: "black"}} to="/login">Login</Link></p> 
            <p style={styles.link}><Link style={{textDecoration: 'none',color: "black"}} to="/signup">Signup</Link></p> 
            
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
    boxShadow: '2px 2px 4px 2px #f0e9e9',
    position: 'fixed',
    top: '0%',
    width: '100%',
    backgroundColor: 'white',
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
    marginTop: '2rem',
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
    backgroundColor: 'white',
    border: 'none',
    cursor: 'pointer'
  },
  active: {
    borderBottom: "2px solid black",
  }
}

export default Navbar