import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAddNewTaskMutation } from "./taskApiSlice"
import useAuth from '../../../hooks/useAuth.js'
import { format } from "date-fns";


export default function CreateTask() {
  const { username, email, id} = useAuth()


  const [addNewTask, {
    isLoadingS,
    isSuccessS,
    isError,
    errors
  }] = useAddNewTaskMutation()

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [task, setTask] = useState('')


  const [finishBy, setFinishBy] = useState('')
  const [tags, setTags] = useState([])
  const [notes, setNotes] = useState([])
  const [links, setLinks] = useState([])
  
  const onCreateTaskClicked = async (e) => {
    e.preventDefault()
    await addNewTask({ user_id: id, finishBy, tags, notes, links, task }).then(() => { navigate("/log/organizer/") })
}

  return <div className="fotivity-container">
    <main className="form-container">
        <form className="form" onSubmit={onCreateTaskClicked}>
            <header>
                <h1>Add Task</h1>
            </header>

            <label htmlFor="task">Task</label>
            <input
                className="form__input"
                type="text"
                id="task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                required
            />


            <label htmlFor="notes">Notes</label>
            <input
                className="form__input"
                type="text"
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            />
            <label htmlFor="links">Links</label>
            <input
                className="form__input"
                type="text"
                id="links"
                value={links}
                onChange={(e) => setLinks(e.target.value)}
            />
            <label htmlFor="tags">Tags</label>
            <input
                className="form__input"
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
            />

            <label htmlFor="finishBy">Finish By</label>
            <input
                className="form__input"
                type="date"
                id="finishBy"
                value={finishBy}
                onChange={(e) => setFinishBy(e.target.value)}
            />
          <button className="form__submit-button">Add</button>
        </form>
    </main>
  </div>
}