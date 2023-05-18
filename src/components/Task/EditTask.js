import { useState } from "react"
import { useUpdateTaskMutation, useDeleteTaskMutation } from "./taskApiSlice"
import { Link, useNavigate, useLocation } from "react-router-dom"
import useAuth from '../../hooks/useAuth.js'
export default function EditTask(props) {
  const { id } = useAuth()

  const navigate = useNavigate()

  const [task, setTask] = useState(props.item.task)

  const [updateTask] = useUpdateTaskMutation()
  const [deleteTask] = useDeleteTaskMutation()

  const onTaskChange = e => setTask(e.target.value)

  const [deleteConfirmation, setDeleteConfirmation] = useState(false)

  const onUpdateTaskClicked = async (e) => {
    e.preventDefault()
    await updateTask({user_id: id, task, id: props.item.id, stage: props.item.stage })

    navigate(0)
  }

  const DeleteTask = async (e) => {
    e.preventDefault()
    await deleteTask({user_id: id, id: props.item.id})
    navigate(0)
  }

  function DeleteTaskConfirmation() {
    setDeleteConfirmation(!deleteConfirmation)
  }

  return (
    <div>
      {
        !deleteConfirmation ? <button onClick={ DeleteTaskConfirmation } style={{...styles.delete}}>Delete</button> : <div style={styles.btnContainer}>
          <button onClick={ DeleteTask } style={{...styles.delete}}>Yes</button>
          <button onClick={ DeleteTaskConfirmation } style={{...styles.btn}}>No</button>
        </div>
      }
      <form className="form" onSubmit={onUpdateTaskClicked}>
        <header>
          <h1>Update Task</h1>
        </header>
        <label htmlFor="task">Task</label>
              <input
                  className="form__input"
                  type="text"
                  id="task"
                  value={task}
                  onChange={onTaskChange}
                  required
              />
        <button>Save</button>
      </form>
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