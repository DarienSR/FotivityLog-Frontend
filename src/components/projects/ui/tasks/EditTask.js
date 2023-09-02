import { useState, useMemo } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { TimePicker } from 'antd';
import useAuth from '../../../../hooks/useAuth.js'
import Dropdown from "../../../modular/Dropdown.js"
import MultipleInput from "../../../modular/MultipleInput.js";
import MultiSelect from "../../../modular/MultiSelect.js";
import { useUpdateProjectTaskMutation, useDeleteProjectTaskMutation} from "../../api/projectTaskApiSlice.js";
import { useGetProjectsQuery } from "../../api/projectApiSlice.js";
export default function EditTask(props) {
  const { state } = useLocation();

  let project_id = props.data.project_id;
  
  const { user_id } = useAuth()

  const {
    data: project,
    isLoading,
    isSuccess,
    error
  } = useGetProjectsQuery(`/projects/${user_id}?_id=${project_id}`, {
    // pollingInterval: 60000, // refresh props.data every minute
    refetchedOnFocus: true, // refresh props.data when window is focused again
    refetchOnMountOrArgChange: true
  })
  

  const navigate = useNavigate()

  


  let options = ["Under Consideration", "Future", "Queue", "Under Development", "Testing", "Finished"]
  
  

  const [task, setTask] = useState(props.data.task)
  const [value, setValue] = useState(props.data.value)
  const [scheduled_for, setScheduledFor] = useState(props.data.scheduled_for || null)

  let formattedTags, defaultTags;


    defaultTags = props.data.tags?.map((tag) => {
      return tag.name
    })

    formattedTags = project?.entities[project?.ids[0]].tags?.map((tag) => {
      return {
        value: tag.name,
        label: tag.name
      }
    }) 

  const [finishBy, setFinishBy] = useState(props.data.finishBy)
  const [desc, setDesc] = useState(props.data.desc || '')
  const [notes, setNotes] = useState(props.data.notes || [])
  const [tags, setTags] = useState(props.data.tags || [])
  const [links, setLinks] = useState(props.data.links || [])
  const [stage, setStage] = useState(props.data.stage || 0)
  const [completed, setCompleted] = useState(props.data.completed || false)
  const [updateTask] = useUpdateProjectTaskMutation()
  const [deleteTask] = useDeleteProjectTaskMutation()

  const onTaskChange = e => setTask(e.target.value)


  const [deleteConfirmation, setDeleteConfirmation] = useState(false)

  const onUpdateTaskClicked = async (e) => {
    e.preventDefault();

    let x = await updateTask({user_id, task, _id: props.data.id, value, tags, finishBy, desc, notes, links, stage, scheduled_for, completed })
    props.toggleModal();
  }

  const DeleteTask = async (e) => {
    e.preventDefault()
    await deleteTask({user_id, _id: props.data.id})
    navigate(0)
  }

  function DeleteTaskConfirmation() {
    setDeleteConfirmation(!deleteConfirmation)
  }

  function UpdateTags(tags) {
    let selectedTags = tags.map((tag) => {
      return project?.entities[project?.ids[0]].tags.find(element => {
        if(element.name === tag)
          return element
      })
    })
    setTags(selectedTags)
  }

  function ToggleCompleted(e) {
    e.preventDefault()
    setCompleted(!completed)
  }

  return (
    <div style={styles.container}>
 <main className="form-container">
        <form style={styles.form} onSubmit={onUpdateTaskClicked}>
            <header>
              <h1>Edit Task</h1>
              <p onClick={ToggleCompleted} style={styles.completeTask}>Toggle Completion</p>
              <p>{completed ? 'Task Completed' : 'Task Scheduled'}</p>
            </header>

            <label htmlFor="task">Task*</label>
            <input
                className="form__input"
                type="text"
                id="task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                required
            />

            <label htmlFor="task">Description</label>
              <input
                  className="form__input"
                  type="text"
                  id="desc"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
              />
<div style={styles.multipleInputs}>

            <Dropdown  
                onChange={ (e) => setStage(e) }
                options={ options }
                label={"Stage"}
                default={stage}
            /> 
              <label htmlFor="value">Value</label>
              <input
                  className="form__input"
                  type="number"
                  id="value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  min="0"
                  required
              />
            </div>


          <MultipleInput values={links} label={"Links"} Update={(e) => setLinks(e)} />

          <MultipleInput values={notes} label={"Notes"} Update={(e) => setNotes(e)} />

           <MultiSelect defaultValue={defaultTags} values={formattedTags} label={"Tags"} Update={(e) => UpdateTags(e)} />
              
            <label htmlFor="finishBy">Finish By</label>
            <input
                className="form__input"
                type="date"
                id="finishBy"
                value={finishBy}
                onChange={(e) => setFinishBy(e.target.value)}
            />
          <button>Update</button>
          {
        !deleteConfirmation ? <button onClick={ DeleteTaskConfirmation } style={{...styles.delete}}>Delete</button> : <div style={styles.btnContainer}>
          <button onClick={ DeleteTask } style={{...styles.delete}}>Yes</button>
          <button onClick={ DeleteTaskConfirmation } style={{...styles.btn}}>No</button>
        </div>
      }
        </form>
    </main>
    </div>
  )
}

let styles = {
  completeTask: {
    backgroundColor: '#a2ffc6'
  },
  container: {
    width: '100%'
  },
  form: {
    width: '100%'
  },
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