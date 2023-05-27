import { useMemo, useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAddNewTaskMutation } from "./taskApiSlice"
import useAuth from '../../hooks/useAuth.js'
import { Col, ColorPicker, Row, Space } from 'antd';
import Dropdown from "../modular/Dropdown"
import MultipleInput from "../modular/MultipleInput";
export default function CreateProjectTask(props) {
  const { username, email, user_id} = useAuth()
  const [addNewTask, {
    isLoadingS,
    isSuccessS,
    isError,
    errors
  }] = useAddNewTaskMutation(user_id)

  const navigate = useNavigate()
  const { pathname, state } = useLocation()

  // determine if task will be assigned to a project, goal, or schedule.
  let belongsToProject = state.belongsToProject
  let belongsToGoal = state.belongsToGoal 

  let project_id = null;
  let options;
  if(belongsToProject) {
    options = ["Under Consideration", "Future", "Queue", "Under Development", "Testing", "Finished"]
    project_id = pathname.split('/')[4]
  }
  
  let redirectPath = belongsToProject ? `/log/projects/${project_id}` : "/log/schedule/";

  
  const [task, setTask] = useState('')
  const [value, setValue] = useState(0)
  const [tagName, setTagName] = useState("")

  const [tagColor, setTagColor] = useState('#1677ff')
  const [formatHex, setFormatHex] = useState('hex');
  const hexString = useMemo(
    () => (typeof tagColor === 'string' ? tagColor : tagColor.toHexString()),
    [tagColor],
  );


  const [finishBy, setFinishBy] = useState('')
  const [desc, setDesc] = useState("")
  const [notes, setNotes] = useState([])
  const [links, setLinks] = useState([])
  const [stage, setStage] = useState(0)
  const [reoccursOn, setReoccursOn] = useState([])
  
  const onCreateTaskClicked = async (e) => {
    // prevent value and stage from being less than 0 

    e.preventDefault()
    await addNewTask({ user_id, stage, value, desc, reoccursOn, belongsToGoal, belongsToProject, finishBy, tag: { color: hexString, name: tagName }, notes, links, task, project_id  }).then(() => { navigate(redirectPath) })
}

  return <div className="fotivity-container">
    <main className="form-container">
        <form className="form" onSubmit={onCreateTaskClicked}>
            <header>
              <h1>Add Task</h1>
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
                default={options[0]}
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



            <MultipleInput label={"Links"} Update={(e) => setLinks(e)} />

            <MultipleInput label={"Notes"} Update={(e) => setNotes(e)} />

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
          <button className="form__submit-button">Add</button>
        </form>
    </main>
  </div>
}

let styles = {

}