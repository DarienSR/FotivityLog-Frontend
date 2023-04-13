import { useGetSessionsQuery } from "./sessionsApiSlice"
import Session from './Session'
import useAuth from '../../hooks/useAuth.js'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import "../../App.css"
const SessionList = () => {

  const { username, email, id} = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const {
    data: sessions,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetSessionsQuery(id, {
    // pollingInterval: 60000, // refresh data every minute
    refetchedOnFocus: true, // refresh data when window is focused again
    refetchOnMountOrArgChange: true
  })

  let content;

  if(isLoading) 
    content = <p>Loading..</p>
  if(isError) {
    content = <div className="component-nav">
    <p style={pathname === '/log/sessions' ? {...styles.link, ...styles.active} : {...styles.link}}><Link style={{textDecoration: 'none',color: "black"}} to="/log/sessions">View Sessions</Link></p>
    <p style={pathname === '/log/sessions/new' ? {...styles.link, ...styles.active} : {...styles.link}}><Link style={{textDecoration: 'none',color: "black"}} to="/log/sessions/new">Add Session</Link></p>
      <input placeholder="Search..." />
  </div>
    
  }
  if(isSuccess) {
    const { ids } = sessions
    const sessionMap = ids?.length ? ids.map(sessionId => <Session key={sessionId} sessionId={sessionId} />) : <p>No Sessions Available</p>
  
    content = (
      <div className="fotivity-container">
        <div className="component-nav">
          <p style={pathname === '/log/sessions' ? {...styles.link, ...styles.active} : {...styles.link}}><Link style={{textDecoration: 'none',color: "black"}} to="/log/sessions">View Sessions</Link></p>
          <p style={pathname === '/log/sessions/new' ? {...styles.link, ...styles.active} : {...styles.link}}><Link style={{textDecoration: 'none',color: "black"}} to="/log/sessions/new">Add Session</Link></p>
            <input placeholder="Search..." />
        </div>
        <div className="sessionList-container">
          { sessionMap }
        </div>
      </div>
    )
  }
  return content;
}

let styles = {
  link: {
    alignSelf: 'center',
    fontSize: '1rem',
    textDecoration: 'none',
    textUnderline: 'none'
  },
  active: {
    borderBottom: "2px solid black",
  }
}

export default SessionList