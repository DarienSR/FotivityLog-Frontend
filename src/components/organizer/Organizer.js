import '../../App.css'
import { useGetScheduledTasksQuery } from './Task/taskApiSlice'
import useAuth from '../../hooks/useAuth.js'
import Task from "./Task/Task"

import { Link, useNavigate, useLocation } from "react-router-dom"
import "../../App.css"

const Organizer = () => {
  const navigate = useNavigate()
  const { username, email, id} = useAuth()

  const {
    data: tasks,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetScheduledTasksQuery(id, {
    // pollingInterval: 60000, // refresh data every minute
    refetchedOnFocus: true, // refresh data when window is focused again
    refetchOnMountOrArgChange: true
  })

  let content;

  if(isLoading) content = <p>Loading...</p>

  if(isSuccess) {
    const { ids } = tasks
    const taskMap = ids?.length ? ids.map(taskId => <Task key={taskId} task={tasks.entities[taskId]} taskId={taskId} />) : <p>No Tasks Available</p>  
    content = (
      <div className="fotivity-container">
        <div className="taskList-container">
          { taskMap }
        </div>
      </div>
    )
  } 

  return (
    <div className='fotivity-container'>
      <h1>Schedule</h1>
      { content }

      <button onClick={() => navigate("./")}>Go to Projects (put in navbar)</button>
      <button onClick={() => navigate("./task/create")}>Create Task</button>
    </div>
  )
}

export default Organizer
