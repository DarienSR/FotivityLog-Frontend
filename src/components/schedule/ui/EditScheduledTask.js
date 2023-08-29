import { useState } from "react"
import { useUpdateScheduledTaskMutation, useDeleteScheduledTaskMutation } from "../api/scheduleApiSlice"
import { useNavigate } from "react-router-dom"
import Header from "../../modular/Header";
import { TimePicker } from 'antd';

export default function EditScheduledTask(props) {
  const navigate = useNavigate()
  
  const [updateTask] = useUpdateScheduledTaskMutation();
  const [deleteTask] = useDeleteScheduledTaskMutation();

  const { user_id, id } = props.data
  const [task, setTask] = useState(props.data.task);
  const [desc, setDesc] = useState(props.data.desc)
  const [scheduledFor, setScheduledFor] = useState(props.data.scheduled_for)
  const [notes, setNotes] = useState(props.data.notes)
  const [tags, setTags] = useState(props.data.tags)
  const [links, setLinks] = useState(props.data.links)
  const [completed, setCompleted] = useState(props.data.completed || false)
  const [timeStart, setTimeStart] = useState(props.data.time_start)
  const [timeFinish, setTimeFinish] = useState(props.data.time_finish)

  async function DeleteTask() {
    alert('delete');
    console.log('tasl top dekere', id);
    await deleteTask({user_id, id});
  }

  function BackClick() {
    props.toggleView();
  }

  async function UpdateTask(e) {
    e.preventDefault();
    
    const url =  `/schedule/tasks/${user_id}/${id}`

    const result = await updateTask({
      url,
      user_id,
      _id: id,
      task,
      desc,
      scheduled_for: scheduledFor,
      time_start: timeStart,
      time_finish: timeFinish,
      completed
    })

    props.toggleView();
  }

  const onTimeStartChange = (time, timeString) => {
    setTimeStart(timeString)
  };

  const onTimeFinishChange = (time, timeString) => {
    setTimeFinish(timeString)
  };

  const onCompletedChange = e => {
    console.log(e.target.checked);
    setCompleted(e.target.checked)
  }

  return (
    <>
      <Header 
        title = "Edit"
        backText = "Back"
        backAction = { BackClick }
        action = { DeleteTask }
        actionText = 'Delete Task'
      />

      <form style={ styles.form } onSubmit={ UpdateTask }>
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