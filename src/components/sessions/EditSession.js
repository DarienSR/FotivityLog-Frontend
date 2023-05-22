import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useGetSessionsByIdQuery, useUpdateSessionMutation, useDeleteSessionMutation } from "./sessionsApiSlice"
import useAuth from '../../hooks/useAuth.js'
import { useParams } from 'react-router-dom'

const EditSession = (props) => {
  const { id } = useParams()

  const {
    data,
    isSuccess
  } = useGetSessionsByIdQuery(id)

  let content = "Loading";


  let session = data?.entities[id]

  
  const { username, email, user_id} = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [topic, setTopic] = useState(session?.topic)
  const [desc, setDescription] = useState(session?.desc)
  const [location, setLocation] = useState(session?.location)
  const [start_time, setStartTime] = useState(session?.start_time)
  const [end_time, setEndTime] = useState(session?.end_time)


  const [activeSession, setActiveSession] = useState(false);

  const [focused, setFocused] = useState(session?.focused)
  const [deep_work, setDeepWork] = useState(session?.deep_work)
  const [social, setSocial] = useState(session?.social)
  const [distracted, setDistracted] = useState(session?.distracted)


  const [updateSession] = useUpdateSessionMutation()

  const [deleteSession, {
    isLoadingDelete,
    isSuccessDelete,
    isErrorDelete,
    errorDelete
  }] = useDeleteSessionMutation()

  const onTopicChanged = e => setTopic(e.target.value)
  const onDescriptionChanged = e => setDescription(e.target.value)
  const onLocationChanged = e => setLocation(e.target.value)
  const onStartTimeChanged = e => setStartTime(e.target.value)
  const onEndTimeChanged = e => setEndTime(e.target.value)



  const onFocusedChanged = e => setFocused(e.target.checked)
  const onDistractedChanged = e => setDistracted(e.target.checked)
  const onSocialChanged = e => setSocial(e.target.checked)
  const onDeepWorkChanged = e => setDeepWork(e.target.checked)

  const [sessionConfirmation, setSessionConfirmation] = useState(true);

  const onUpdateSessionClicked = async (e) => {
    e.preventDefault()
    await updateSession({user_id, topic, desc, location, id: session.id, start_time, end_time, focused, deep_work, social, distracted  })
    navigate("/log/sessions")
  }

  const DeleteSession = async (e) => {
    e.preventDefault()
    await deleteSession(session.id)
    navigate("/log/sessions")
  }

  function DeleteSessionConfirmation() {
    setSessionConfirmation(!sessionConfirmation);
  }


  function PopulateForm(session) {
    setTopic(session.topic)
    setDescription(session.desc)
    setLocation(session.location)
    setStartTime(session.start_time)
    setEndTime(session.end_time)

    setFocused(session.focused)
    setDeepWork(session.deep_work)
    setSocial(session.social)
    setDistracted(session.distracted)
  }

  if(isSuccess) {

  // on first run through topic will be undefined so we can do this. Otherwise infinte re-render. Topic should ALWAYS be set
    if(topic === undefined)
      PopulateForm(session)

    content = <main className="form-container">
    <form className="form" onSubmit={onUpdateSessionClicked}>
        <header>
            <h1>Update Session</h1>
        </header>

        <label htmlFor="topic">Topic</label>
        <input
            className="form__input"
            type="text"
            id="topic"
            value={topic}
            onChange={onTopicChanged}
            required
        />
        <label htmlFor="desc">Description</label>
        <input
            className="form__input"
            type="text"
            id="desc"
            value={desc}
            onChange={onDescriptionChanged}
            autoComplete="off"
            
        />
        <label htmlFor="location">Location</label>
        <input
            className="form__input"
            type="text"
            id="location"
            value={location}
            onChange={onLocationChanged}
            autoComplete="off"
            
        />

      <label htmlFor="start_time">Start Time</label>
      <input
          className="form__input"
          type="text"
          id="start_time"
          value={start_time}
          onChange={onStartTimeChanged}
          autoComplete="off"
          required
      />

      <label htmlFor="end_time">End Time</label>
      <input
          className="form__input"
          type="text"
          id="end_time"
          value={end_time}
          onChange={onEndTimeChanged}
          autoComplete="off"
          required
      />

        <div className="checkbox-container">
            <label htmlFor="social">Social</label>
            <input checked={social} onChange={ onSocialChanged } id="social" type="checkbox" />
            
            <label htmlFor="distracted">Distracted</label>
            <input checked={distracted} onChange={ onDistractedChanged } id="distracted" type="checkbox" />
            
            <label htmlFor="focused">Focused</label>
            <input checked={focused} onChange={ onFocusedChanged } id="focused" type="checkbox" />
            <label htmlFor="deepwork">Deep Work</label>
            <input checked={deep_work} onChange={ onDeepWorkChanged } id="deepwork" type="checkbox" />
        </div>

        <button className="button">Update</button>
    </form>
  </main>
  }



  return (
    <div className="fotivity-container">

    <div className="component-nav">
        <p style={styles.link}><Link style={{textDecoration: 'none',color: "black"}} to="/log/sessions">Back</Link></p>
        {
          sessionConfirmation ? <button onClick={ DeleteSessionConfirmation } style={{...styles.delete}}>Delete</button> : <div style={styles.btnContainer}>
            <button onClick={ DeleteSession } style={{...styles.delete}}>Yes</button>
            <button onClick={ DeleteSessionConfirmation } style={{...styles.btn}}>No</button>
          </div>

        }
    </div>


      { content }
  </div>
  )
}
let styles = {
  start: {
      alignSelf: 'center',
      marginBottom: '100%'
  },
  link: {
    alignSelf: 'center',
    fontSize: '1rem',
    textDecoration: 'none',
    textUnderline: 'none'
  },
  active: {
    borderBottom: "2px solid black",
  },
  delete: {
    width: '30%',
    padding: '0.5rem',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    backgroundColor: '#ff7d77',
    fontSize: '1.1rem',
    cursor: 'pointer'
  },
  btn: {
    width: '30%',
    padding: '0.5rem',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    backgroundColor: 'black',
    fontSize: '1.1rem',
    cursor: 'pointer'
  },
  btnContainer: {
    width: '30%',
    display: 'flex',
    justifyContent: 'space-evenly'
  }
}

export default EditSession