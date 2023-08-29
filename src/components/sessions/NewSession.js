import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAddNewSessionMutation, useCheckForActiveSessionQuery, useUpdateSessionMutation } from "./sessionsApiSlice"
import useAuth from '../../hooks/useAuth.js'
import { format } from "date-fns";


const NewSession = () => {
    const { username, email, user_id} = useAuth()

    let { data, refetch, isLoading, isSuccess, error } = useCheckForActiveSessionQuery(user_id, {
        count: 5 ,
    })
 
    const [addNewSession, {
        isLoadingS,
        isSuccessS,
        isError,
        errors
    }] = useAddNewSessionMutation()
    
    const [updateSession, {
        isLoadingUpdate,
        isSuccessUpdate,
        isErrorUpdate,
        errorUpdate
    }] = useUpdateSessionMutation()

    const navigate = useNavigate()
    const { pathname, state } = useLocation()
    const [topic, setTopic] = useState(state?.project.name || '')
    const [desc, setDescription] = useState(state?.task ? `${state?.task.task} - ${state?.task.desc}` : '')
    const [linkToTask, setLinkToTask] = useState(state?.task.id || null)
    const [location, setLocation] = useState('')
    const [activeSession, setActiveSession] = useState(false);
    
    const onTopicChanged = e => setTopic(e.target.value)
    const onDescriptionChanged = e => setDescription(e.target.value)
    const onLocationChanged = e => setLocation(e.target.value)

    const [focused, setFocused] = useState(false)
    const [deep_work, setDeepWork] = useState(false)
    const [social, setSocial] = useState(false)
    const [distracted, setDistracted] = useState(false)
    const [currentSession, setCurrentSession] = useState(null)
    const onFocusedChanged = e => setFocused(e.target.checked)
    const onDistractedChanged = e => setDistracted(e.target.checked)
    const onSocialChanged = e => setSocial(e.target.checked)
    const onDeepWorkChanged = e => setDeepWork(e.target.checked)

    function getCurrentTime() {
        return format(new Date(), "yyyy-MM-dd hh:mm aaaaa'm'");
    }

    // Initialize Session
    const onStartSessionClicked = async (e) => {
        e.preventDefault()
        setActiveSession(true)
        await addNewSession({ user_id, start_time: getCurrentTime() })
    }

    let display = null;
    // Update Session when user is finished.
    const onSaveSessionClicked = async (e) => {
        e.preventDefault()
        await updateSession({ id: data.ids[0], user_id, topic, desc, location, social, focused, distracted, deep_work, start_time: data.entities[data.ids[0]].start_time, end_time: getCurrentTime(), linkToTask })  
        refetch() // force re-fetches the data, which checks for an active sessions. Find nothing because we just saved the new session.
        navigate("/log/sessions")
    }

    if(isLoading) {
        display = <p>Loading....</p>
    } else if (isSuccess && data.ids.length >= 1 && !activeSession) {
        setCurrentSession(data.entities[data.ids[0]])
        setActiveSession(true)
    } else {
        display = <div className="form-container">
        <form className="form" onSubmit={onStartSessionClicked}>
            <button style={styles.start}>Start</button> 
        </form>
    </div>
    }

    const content = (
        <div className="fotivity-container">        
            <div className="component-nav">
                <p style={pathname === '/log/sessions' ? {...styles.link, ...styles.active} : {...styles.link}}><Link style={{textDecoration: 'none',color: "black"}} to="/log/sessions">View Sessions</Link></p>
                <p style={pathname === '/log/sessions/new' ? {...styles.link, ...styles.active} : {...styles.link}}><Link style={{textDecoration: 'none',color: "black"}} to="/log/sessions/new">Add Session</Link></p>
            </div>
            <main className="form-container">
                { activeSession ? 
                <form className="form" onSubmit={onSaveSessionClicked}>
                    <header>
                        <h1>Add Session</h1>
                    </header>
        
                    <p>Started at: {currentSession?.start_time}</p>
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
                    <label htmlFor="start-time">Location</label>
                    <input
                        className="form__input"
                        type="text"
                        id="start"
                        value={location}
                        onChange={onLocationChanged}
                        autoComplete="off"
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

                    <button className="form__submit-button">Add</button>
                </form>
                : {...display}
            }
            </main>
        </div>
    )

    return content
}

let styles = {
    start: {
        alignSelf: 'center',
        marginBottom: '100%',
    },
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
  
export default NewSession