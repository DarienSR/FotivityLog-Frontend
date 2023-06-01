import { ProjectBoard } from "../dnd/ProjectBoard"
import { useNavigate, useLocation } from "react-router-dom"
import { useGetProjectByIdQuery} from "./projectApiSlice";
export default function Project() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  let project_id = pathname.split('/').splice(-1)[0]

  const {
    data: project,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetProjectByIdQuery(project_id, {
    // pollingInterval: 60000, // refresh data every minute
    refetchedOnFocus: true, // refresh data when window is focused again
    refetchOnMountOrArgChange: true
  })

  let projectInfo;
  if(isSuccess) {
    projectInfo = project.entities[project.ids[0]]
    console.log("PROJECT DETAILS", project.entities[project.ids[0]])
  }
  return <>



    <div>
      <button onClick={() => navigate(`/log/projects/task/${project_id}/new`, { state: { belongsToProject: true, belongsToGoal: false  } })}>New Task</button>
    </div>
    <ProjectBoard projectInfo={projectInfo} />
  </>
}