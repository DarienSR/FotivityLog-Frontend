import { NestedListComponent } from "../dnd/NestedListComponent"
import { useNavigate, useLocation } from "react-router-dom"
export default function ProjectBoard() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  
  let project_id = pathname.split('/').splice(-1)[0]
  return <>
    <div>
      <p>Project Details - edit, delete, modify settings, etc</p>
      <p>Condensed View</p>
      <p>Detailed View</p>
      <button onClick={() => navigate(`/log/projects/task/${project_id}/new`)}>New Task</button>
    </div>
    <NestedListComponent />
  </>
}