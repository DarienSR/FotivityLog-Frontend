import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useUpdateProjectMutation } from "./projectApiSlice"
import useAuth from '../../hooks/useAuth.js'
import "../../App.css"
import SetTags from "../modular/SetTags";

export default function EditProject(props) {
  const { user_id} = useAuth()
  const [updateProject] = useUpdateProjectMutation()
  const navigate = useNavigate()
 


  console.log("--->", props)
  const [name, setName] = useState(props.project.name || "")
  const [tags, setTags] = useState(props.project.tags || [])
  

  const onUpdateProjectClicked = async (e) => {
    e.preventDefault()
    let updatedProject = {user_id, name, tags, id: props.project._id}
    await updateProject(updatedProject).then(() => { navigate(`/log/projects/${props.project._id}`, { state: {project: updatedProject} })})
    props.ToggleEdit()
}

  return <div className="fotivity-container">
    <main className="form-container">
        <form className="form" onSubmit={onUpdateProjectClicked}>
            <header>
                <h1>Edit Project</h1>
                <button className="button-secondary" onClick={() => props.ToggleEdit()}>Back</button>
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

          <SetTags values={tags} Update={(e) => setTags(e)} />

          <button>Update Project</button>
        </form>
    </main>
  </div>
}