import '../../App.css'
import { useGetScheduledTasksQuery } from '../task/taskApiSlice'
import useAuth from '../../hooks/useAuth.js'
import { ScheduleBoard } from '../dnd/ScheduleBoard'
import { Link, useNavigate, useLocation } from "react-router-dom"
import "../../App.css"

const Schedule = () => {
  const navigate = useNavigate()
  const { username, email, user_id} = useAuth()

  let content;


  return (
    <div className='fotivity-container'>
      <h1>Schedule</h1>
      <button onClick={() => navigate("./task/create")}>Create Task</button>
      <ScheduleBoard />

    </div>
  )
}

export default Schedule
