import { useState } from "react"
import { useUpdateTaskMutation, useDeleteTaskMutation } from "./taskApiSlice"
import { Link, useNavigate, useLocation } from "react-router-dom"
import useAuth from '../../hooks/useAuth.js'
import EditTask from "./EditTask"
export default function ViewTask(props) {
  const { user_id } = useAuth()

  const navigate = useNavigate()

  const [task, setTask] = useState(props.item.task)
  const [toggleEdit, setToggleEdit] = useState(false)

  const [updateTask] = useUpdateTaskMutation()
  const [deleteTask] = useDeleteTaskMutation()

  const onTaskChange = e => setTask(e.target.value)


  const [deleteConfirmation, setDeleteConfirmation] = useState(false)

  const onUpdateTaskClicked = async (e) => {
    e.preventDefault()
    await updateTask({user_id, task, id: props.item.id, stage: props.item.stage })

    navigate(0)
  }

  const DeleteTask = async (e) => {
    e.preventDefault()
    await deleteTask({user_id, id: props.item.id})
    navigate(0)
  }

  function DeleteTaskConfirmation() {
    setDeleteConfirmation(!deleteConfirmation)
  }

  let view =     <div style={styles.taskContainer}>
  <h3  style={styles.task}>{props.item.task}</h3>
  <p style={styles.desc}>{props.item.desc}</p>

  <div>
    <div>
      <p>Notes</p>
      { props.item.notes?.map((note) => {
        return <p style={styles.misc}>
          - {note}
        </p>
      }) }
    </div>
    <div>
      <p>Links</p>
      { props.item.links?.map((link) => {
        return <p style={styles.misc}>
          - <a href={link}>{link}</a> 
        </p>
      }) }
    </div>

  </div>
  <hr />
  <button onClick={() => setToggleEdit(!toggleEdit)}>Edit Task</button>
</div>

  return !toggleEdit ? view : <EditTask ToggleEdit={setToggleEdit} item={props.item} state={{belongsToProject: true, belongsToGoal: false}} /> 
  
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