import { Link } from 'react-router-dom'
import "../App.css"
const Landing = () => {
  return (
    <div className="fotivity-container">
      <h1>FotivityLog</h1>
      <h3>A web application that promotes better organization, time utilization, and intentional productivity.</h3>
      <p>- Features an analytical dashboard where you can track study/work sessions and assign metrics to those sessions</p>
      <p>- Features a flow board to track different task states in your projects.</p>
      <p>- Features a monthly, weekly, and daily planner to stay on top of your time.</p>
      <p>- All tasks (scheduled and project tasks) are integrated and tracked through your session tracker. Which records the time it takes to complete each tasks and records metrics related to your session.</p>

      <br></br>

      <p>This application is very much a <b>work in progress.</b> and is being developed only by me. More functionality will be implemented and UI design changes will come eventually to make the site look more appealing. If you have any comment or suggestions, your feedback would be greatly appreciated. You can contact me at: <b>fotivitylog@gmail.com</b></p>

    </div>
  )
}

export default Landing