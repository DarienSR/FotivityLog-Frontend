import { useState } from "react"
import { useNewScheduledTaskMutation } from "../api/scheduleApiSlice"
import { useNavigate } from "react-router-dom"
import Header from "../../modular/Header";
import { TimePicker } from 'antd';
import { useLocation } from "react-router-dom"
import useAuth from '../../../hooks/useAuth.js'
export default function CreateScheduledTask(props) {
  const navigate = useNavigate()
  const { user_id } = useAuth()
  const [addTask] = useNewScheduledTaskMutation();

  const [task, setTask] = useState('');
  const [desc, setDesc] = useState('')
  const [scheduledFor, setScheduledFor] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState([])
  const [tags, setTags] = useState([])
  const [links, setLinks] = useState([])
  const [completed, setCompleted] = useState(false)
  const [timeStart, setTimeStart] = useState('')
  const [timeFinish, setTimeFinish] = useState('')

  async function AddTask(e) {
    e.preventDefault();
    const result = await addTask({
      user_id,
      task,
      desc,
      scheduled_for: scheduledFor,
      time_start: timeStart,
      time_finish: timeFinish,
      completed,
      notes,
      tags,
      links,
      created_on: new Date().toString()
    })

    navigate(-1)
  }

  const onTimeStartChange = (time, timeString) => {
    setTimeStart(timeString)
  };

  const onTimeFinishChange = (time, timeString) => {
    setTimeFinish(timeString)
  };

  const onCompletedChange = e => {
    setCompleted(e.target.checked)
  }

  return (
    <>
      <Header 
        title = "Add"
        backText = "Back"
      />

      <form style={ styles.form } onSubmit={ AddTask }>
        <span style={ styles.field }>
          <label style={ styles.label } htmlFor="">Task</label>
          <input 
            style={ styles.input }
            type="text"
            id="task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
        </span>

        <span style={ styles.field }>
          <label style={ styles.label } htmlFor="">Description</label>
          <input 
            style={ styles.input }
            type="text"
            id="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </span>

        <span style={ styles.field }>
          <label style={ styles.label } htmlFor="">Scheduled For</label>
          <input 
            style={ styles.input }
            type="date"
            id="scheduled_for"
            value={scheduledFor}
            onChange={(e) => setScheduledFor(e.target.value)}
          />
        </span>

        <span style={ styles.field }>
          <label style={ styles.label } htmlFor="">Start Time</label>
          <TimePicker use12Hours format="h:mm a" onChange={onTimeStartChange} />
        </span>

        <span style={ styles.field }>
          <label style={ styles.label } htmlFor="">Finish Time</label>
          <TimePicker use12Hours format="h:mm a" onChange={onTimeFinishChange} />
        </span>

        <span style={ styles.field }>
          <label style={ styles.label } htmlFor="">Completed</label>
          <input 
            style={ styles.input }
            type="checkbox"
            id="completed"
            checked={completed}
            onClick={onCompletedChange}
          />
        </span>

        <button style={ styles.submit }>Submit</button>
      </form>
    </>
  )
}

let styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '40%',
    margin: '0 auto',
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    padding: '1rem',
    boxShadow: '#00000052 0px 2px 2px',
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem'
  },

  label: {
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  
  input: {
    fontSize: '1.3rem',
    border: '2px solid #463A3A',
    padding: '0.3rem',
    borderRadius: '10px',
  },

  submit: {
    borderRadius: '10px',
    border: '2px solid #FFFFFF',
    color: '#463A3A',
    backgroundColor: '#FFFFFF',
    boxShadow: '#00000052 0px 2px 2px',
    padding: '0.5rem',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    alignSelf: 'flex-end',
  }
}