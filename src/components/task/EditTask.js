import { useState, useMemo } from "react"
import { useUpdateTaskMutation, useDeleteTaskMutation } from "./taskApiSlice"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Col, ColorPicker, Row, Space } from 'antd';
import useAuth from '../../hooks/useAuth.js'
import Dropdown from "../modular/Dropdown"
import MultipleInput from "../modular/MultipleInput";
export default function EditTask(props) {
  const { user_id } = useAuth()

  const navigate = useNavigate()

  
  // determine if task will be assigned to a project, goal, or schedule.
  let belongsToProject = props.state.belongsToProject
  let belongsToGoal = props.state.belongsToGoal 
  
  let project_id = null;
  let options;
  if(belongsToProject) {
    options = ["Under Consideration", "Future", "Queue", "Under Development", "Testing", "Finished"]
  }
  
  const [task, setTask] = useState(props.item.task)
  const [value, setValue] = useState(props.item.value)
  const [tagName, setTagName] = useState(props.item.tag?.name)

  const [tagColor, setTagColor] = useState(props.item.tag?.color)
  const [formatHex, setFormatHex] = useState('hex');
  const hexString = useMemo(
    () => (typeof tagColor === 'string' ? tagColor : tagColor.toHexString()),
    [tagColor],
  );


  const [finishBy, setFinishBy] = useState(props.item.finishBy)
  const [desc, setDesc] = useState(props.item.desc)
  const [notes, setNotes] = useState(props.item.notes)
  const [links, setLinks] = useState(props.item.links)
  const [stage, setStage] = useState(props.item.stage)
  const [reoccursOn, setReoccursOn] = useState([])

  const [updateTask] = useUpdateTaskMutation()
  const [deleteTask] = useDeleteTaskMutation()

  const onTaskChange = e => setTask(e.target.value)


  const [deleteConfirmation, setDeleteConfirmation] = useState(false)

  const onUpdateTaskClicked = async (e) => {
    e.preventDefault()
    await updateTask({user_id, task, id: props.item.id, value, tag: {name: tagName, color: hexString}, finishBy, desc, notes, links, stage })
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

            <div style={styles.multipleInputs}>
              <label>Tag Name {tagName || ""}</label>
              <input
                  className="form__input"
                  type="text"
                  id="desc"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                />

              <div>
                <label>Tag Color</label>
                <ColorPicker
                  format={formatHex}
                  value={tagColor}
                  onChange={setTagColor}
                  onFormatChange={setFormatHex}
                />
              </div>
            </div>
              
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