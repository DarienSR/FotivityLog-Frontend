import { useState } from "react"
import { useUpdateProjectTaskMutation, useDeleteProjectTaskMutation } from  "../../api/projectTaskApiSlice"
import { Link, useNavigate, useLocation } from "react-router-dom"
import useAuth from '../../../../hooks/useAuth.js'
import EditTask from "./EditTask"
export default function ViewTask(props) {
  const { user_id } = useAuth()
  const navigate = useNavigate()
  const [task, setTask] = useState(props.data.task)
  const [toggleEdit, setToggleEdit] = useState(false)

  const [updateTask] = useUpdateProjectTaskMutation()
  const [deleteTask] = useDeleteProjectTaskMutation()

  const onTaskChange = e => setTask(e.target.value)


  const [deleteConfirmation, setDeleteConfirmation] = useState(false)

  const onUpdateTaskClicked = async (e) => {
    e.preventDefault()
    await updateTask({user_id, task, id: props.data.id, stage: props.data.stage })

    navigate(0)
  }

  const DeleteTask = async (e) => {
    e.preventDefault()
    await deleteTask({user_id, id: props.data.id})
    navigate(0)
  }

  function DeleteTaskConfirmation() {
    setDeleteConfirmation(!deleteConfirmation)
  }

  let view =     <div style={styles.taskContainer}>
  <h3  style={styles.task}>{props.data.task}</h3>
  <p style={styles.desc}>{props.data.desc}</p>

  <div>
    <div>
      <p>Notes</p>
      { props.data.notes?.map((note) => {
        return <p style={styles.misc}>
          - {note}
        </p>
      }) }
    </div>
    <div>
      <p>Links</p>
      { props.data.links?.map((link) => {
        return <p style={styles.misc}>
          - <a href={link}>{link}</a> 
        </p>
      }) }
    </div>
    {props.data.timeStart}
    -
    {props.data.timeFinish}
  </div>
  <hr />
  <button onClick={() => navigate(`/log/sessions/new/`, {state: { project: props.project, task: props.data }})}>Go to Session</button>
  <button onClick={() => setToggleEdit(!toggleEdit)}>Edit Task</button>
</div>

  return !toggleEdit ? view : <EditTask ToggleEdit={setToggleEdit} item={props.data} state={{belongsToProject: props.belongsToProject, belongsToGoal: props.belongsToGoal}} /> 
  
}

let styles = {
  task: {
    textAlign: 'center'
  },
  desc: {

  },
  misc: {
    marginLeft: '1rem'
  }
}