import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "../../App.css"

import { useGetSessionsByIdQuery } from "./sessionsApiSlice"
const Session = ({ sessionId }) => {
//  const session = useSelector(state => selectSessionById(state, sessionId))

const {
  data,
  isLoading,
  isSuccess,
  isError,
  error
} = useGetSessionsByIdQuery(sessionId, {

})

  let session = data?.entities[sessionId]
  const navigate = useNavigate()

  if(session) {
    const handleEdit = () => navigate(`/log/sessions/edit/${sessionId}`)

    const currentSession = session.end_time === null ? 'session-active session' : 'session'
  
    return (
        <>
        { session.end_time !== null ? <div className={`${currentSession}`}>
            <p style={styles.topic}>{ session.topic.toUpperCase() }</p>
            <div style={styles.info}>
              <span style={styles.dates}>
                <p>{ session.start_time }</p>
                <p>{ session.end_time }</p>
              </span>
              <p>{ session.desc === "" ? "No desc." : session.desc }</p>

              <div style={styles.booleanContainer}>
                { session.distracted ? <p style={{...styles.booleans, ...styles.distracted}}>Distracted</p> : null}
                { session.focused ? <p style={{...styles.booleans, ...styles.focused}}>Focused</p> : null}
                { session.deep_work ? <p style={{...styles.booleans, ...styles.deep_work}}>Deep Work</p> : null}
                { session.social ? <p style={{...styles.booleans, ...styles.social}}>Social</p> : null}
              </div>
            </div>
      
            <button style={styles.button} onClick={handleEdit} className="button">
              Edit
            </button> 
          </div> : <div className={`${currentSession}`}>
            <p style={styles.topic}>ACTIVE SESSION</p>
          </div> }
        </>
    )
  } else return null

}

let styles = {
  topic: {
    textAlign: 'center',
    fontSize: '1.4rem',
    fontWeight: 'bold',
    margin: 0
  },
  dates: {
    display: 'flex',
    justifyContent: 'space-around'
  },
  info: {
    maxHeight: "67%",
    minHeight: "67%",
  },
  button: {
    width: '100%',
    fontSize: '1rem',
    padding: '0.5rem',
    border: '2px solid black',
    borderRadius:'0.5rem',
    backgroundColor: '#fdfdfd',
    cursor: 'pointer'
  },
  booleanContainer: {
    display: 'flex'
  },
  booleans: {
    width: '20%',
    color: 'black',
    padding: '0.2rem',
    textAlign: 'center',
    marginRight: '0.4rem'
  },
  distracted: {
    backgroundColor: "#fff765"
  },
  focused: {
    backgroundColor: "#65ff91"
  },
  deep_work: {
    backgroundColor: "#65fff5"
  },
  social: {
    backgroundColor: '#ff65d3'
  }
}

export default Session