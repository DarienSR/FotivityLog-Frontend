import '../../App.css'
import { useGetScheduledTasksQuery } from '../Task/taskApiSlice'
import useAuth from '../../hooks/useAuth.js'
import Task from "../Task/Task"
import { ScheduleDnD } from '../dnd/ScheduleDnd'
import { Link, useNavigate, useLocation } from "react-router-dom"
import "../../App.css"

const Schedule = () => {
  const navigate = useNavigate()
  const { username, email, id} = useAuth()



  let content;


  return (
    <div className='fotivity-container'>
      <h1>Schedule</h1>
      <button onClick={() => navigate("./task/create")}>Create Task</button>
      <ScheduleDnD />

    </div>
  )
}

export default Schedule
