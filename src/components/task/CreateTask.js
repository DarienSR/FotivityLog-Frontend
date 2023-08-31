import { useMemo, useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import useAuth from '../../hooks/useAuth.js'
import { Col, ColorPicker, Row, Space } from 'antd';
import Dropdown from "../modular/Dropdown"
import MultipleInput from "../modular/MultipleInput";
import MultiSelect from "../modular/MultiSelect";
import { useGetProjectTasksQuery, useAddNewProjectTaskMutation} from "../projects/api/projectTaskApiSlice";
import { TimePicker } from 'antd';
export default function CreateProjectTask(props) {
  const { username, email, user_id} = useAuth()
  const [addNewTask] = useAddNewProjectTaskMutation()

  const navigate = useNavigate()
  const { pathname, state } = useLocation()


  // determine if task will be assigned to a project, goal, or schedule.
  let belongsToProject = state.belongsToProject
  let belongsToGoal = state.belongsToGoal 

  let project_id = null;
  let options = [];
  if(belongsToProject) {
    options = ["Under Consideration", "Future", "Queue", "Under Development", "Testing", "Finished"]
    project_id = pathname.split('/')[4]
  }
  
  let redirectPath = belongsToProject ? `/log/projects/${project_id}` : "/log/schedule/";

  const {
    data: project,
    isLoading,
    isSuccess,
    error
  } = useGetProjectTasksQuery(`/projects/${user_id}/${project_id}/tasks`, {
    // pollingInterval: 60000, // refresh data every minute
    refetchedOnFocus: true, // refresh data when window is focused again
    refetchOnMountOrArgChange: true
  })


  
  const [task, setTask] = useState('')
  const [value, setValue] = useState(0)
  const [tags, setTags] = useState([])

  let formattedTags ;
  if(isSuccess) {
    formattedTags = project.entities[project.ids[0]].tags.map((tag) => {
      return {
        value: tag.name,
        label: tag.name
      }
    }) 

  }


  const [finishBy, setFinishBy] = useState('')
  const [desc, setDesc] = useState("")
  const [scheduled_for, setScheduledFor] = useState(state.selectedDate || null)
  const [notes, setNotes] = useState([])
  const [links, setLinks] = useState([])
  const [stage, setStage] = useState(0)
  const [timeStart, setTimeStart] = useState()
  const [timeFinish, setTimeFinish] = useState()
  const onCreateTaskClicked = async (e) => {
    // prevent value and stage from being less than 0 

    e.preventDefault()
    console.log('Adding new task to project', project_id, user_id);

    await addNewTask({ user_id, stage, value, desc, scheduled_for, timeStart, timeFinish, belongsToGoal, belongsToProject, finishBy, tags, notes, links, task, project_id  }).then(() => { navigate(redirectPath) })
}

  const onTimeStartChange = (time, timeString) => {
    setTimeStart(timeString)
  };

  const onTimeFinishChange = (time, timeString) => {
    setTimeFinish(timeString)
  };

  function UpdateTags(tags) {
    let selectedTags = [];
    for(let i = 0; i < tags.length; i++) {
      let index = project.entities[project.ids[0]].tags.findIndex(tag => tag.name === tags[i])
      selectedTags.push(project.entities[project.ids[0]].tags[index])
    }
    setTags(selectedTags)
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
                <TimePicker use12Hours format="h:mm a" onChange={onTimeStartChange} />
                <TimePicker use12Hours format="h:mm a" onChange={onTimeFinishChange} />
              </> : null }

            <div style={styles.multipleInputs}>
             { options.length > 0 ? <Dropdown  
                onChange={ (e) => setStage(e) }
                options={ options }
                label={"Stage"}
                default={options[0]}
              /> : null
             }

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

            <MultiSelect values={formattedTags} label={"Tags"} Update={(e) => UpdateTags(e)} />
              
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