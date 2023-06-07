import { useState, useMemo } from "react"
import { useUpdateTaskMutation, useDeleteTaskMutation } from "./taskApiSlice"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Col, ColorPicker, Row, Space } from 'antd';
import useAuth from '../../hooks/useAuth.js'
import Dropdown from "../modular/Dropdown"
import MultipleInput from "../modular/MultipleInput";
import MultiSelect from "../modular/MultiSelect";
import { useGetProjectByIdQuery} from "../projects/projectApiSlice";
export default function EditTask(props) {
  let project_id = props.item.project_id;
  const {
    data: project,
    isLoading,
    isSuccess,
    error
  } = useGetProjectByIdQuery(project_id, {
    // pollingInterval: 60000, // refresh data every minute
    refetchedOnFocus: true, // refresh data when window is focused again
    refetchOnMountOrArgChange: true
  })
  
  
  const { user_id } = useAuth()

  const navigate = useNavigate()

  
  // determine if task will be assigned to a project, goal, or schedule.
  let belongsToProject = props.state.belongsToProject
  let belongsToGoal = props.state.belongsToGoal 

  let options; 
  if(belongsToProject) {
    options = ["Under Consideration", "Future", "Queue", "Under Development", "Testing", "Finished"]
  }
  

  const [task, setTask] = useState(props.item.task)
  const [value, setValue] = useState(props.item.value)
  const [scheduled_for, setScheduledFor] = useState(props.item.scheduled_for || null)

  let formattedTags, defaultTags;
  if(isSuccess) {

    defaultTags = props.item.tags?.map((tag) => {
      return tag.name
    })

    formattedTags = project.entities[project.ids[0]].tags?.map((tag) => {
      return {
        value: tag.name,
        label: tag.name
      }
    }) 

    console.log("def", defaultTags)

  }


  const [finishBy, setFinishBy] = useState(props.item.finishBy)
  const [desc, setDesc] = useState(props.item.desc)
  const [notes, setNotes] = useState(props.item.notes)
  const [tags, setTags] = useState(props.item.tags)
  const [links, setLinks] = useState(props.item.links)
  const [stage, setStage] = useState(props.item.stage)
  const [reoccursOn, setReoccursOn] = useState([])

  const [updateTask] = useUpdateTaskMutation()
  const [deleteTask] = useDeleteTaskMutation()

  const onTaskChange = e => setTask(e.target.value)


  const [deleteConfirmation, setDeleteConfirmation] = useState(false)

  const onUpdateTaskClicked = async (e) => {
    e.preventDefault()
    await updateTask({user_id, task, id: props.item.id, value, tags, finishBy, desc, notes, links, stage, scheduled_for })
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

  function UpdateTags(tags) {
    let selectedTags = tags.map((tag) => {
      return project.entities[project.ids[0]].tags.find(element => {
        if(element.name === tag)
          return element
      })
    })
    setTags(selectedTags)
  }

  return (
    <div style={styles.container}>
      {
        !deleteConfirmation ? <button onClick={ DeleteTaskConfirmation } style={{...styles.delete}}>Delete</button> : <div style={styles.btnContainer}>
          <button onClick={ DeleteTask } style={{...styles.delete}}>Yes</button>
          <button onClick={ DeleteTaskConfirmation } style={{...styles.btn}}>No</button>
        </div>
      }
 <main className="form-container">
        <form style={styles.form} onSubmit={onUpdateTaskClicked}>
            <header>
              <h1>Edit Task</h1>
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

            {!belongsToProject && !belongsToGoal? 
              <>
                <label htmlFor="task">Scheduled For</label>
                <input
                    className="form__input"
                    type="date"
                    id="scheduled_for"
                    value={scheduled_for}
                    onChange={(e) => setScheduledFor(e.target.value)}
                /> 
              </> : <Dropdown  
                onChange={ (e) => setStage(e) }
                options={ options }
                label={"Stage"}
                default={stage}
            /> }


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
        </form>
    </main>
    </div>
  )
}

let styles = {
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