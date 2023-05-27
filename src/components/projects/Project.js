import { ProjectBoard } from "../dnd/ProjectBoard"
import { useNavigate, useLocation } from "react-router-dom"
export default function Project() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  
  let project_id = pathname.split('/').splice(-1)[0]
  return <>
    <div>
      <button onClick={() => navigate(`/log/projects/task/${project_id}/new`, { state: { belongsToProject: true, belongsToGoal: false } })}>New Task</button>
    </div>
    <ProjectBoard />
  </>
}