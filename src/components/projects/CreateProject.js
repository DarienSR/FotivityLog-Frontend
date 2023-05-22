import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAddNewProjectMutation } from "./projectApiSlice"
import useAuth from '../../hooks/useAuth.js'
import { format } from "date-fns";


export default function CreateProject() {
  const { username, email, user_id} = useAuth()


  const [addNewProject, {
    isLoadingS,
    isSuccessS,
    isError,
    errors
  }] = useAddNewProjectMutation()

  const navigate = useNavigate()
  const { pathname } = useLocation()




  const [name, setName] = useState('')


  
  const onCreateProjectClicked = async (e) => {
    e.preventDefault()
    await addNewProject({ user_id, name }).then(() => { navigate("/log/projects") })
}

  return <div className="fotivity-container">
    <main className="form-container">
        <form className="form" onSubmit={onCreateProjectClicked}>
            <header>
                <h1>Add Project</h1>
            </header>

            <label htmlFor="project">Project</label>
            <input
                className="form__input"
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />

          <button className="form__submit-button">Add</button>
        </form>
    </main>
  </div>
}