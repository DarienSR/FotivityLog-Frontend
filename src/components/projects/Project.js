import React, { useState } from "react";
import { ProjectBoard } from "../dnd/ProjectBoard"
import { useNavigate, useLocation } from "react-router-dom"
import { useGetProjectByIdQuery} from "./projectApiSlice";
import EditProject from "../projects/EditProject";
import "../../App.css"
export default function Project() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  let project_id = pathname.split('/').splice(-1)[0]
  const [projectEdit, setProjectEdit] = useState(false)
  const [projectInfo, setProjectInfo] = useState(null)
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

  
  if(isSuccess && projectInfo === null) {
    setProjectInfo(project.entities[project.ids[0]])
    console.log("info", project.entities[project.ids[0]])
  }

  function ToggleEditProject() {
    setProjectEdit(!projectEdit)
  }


  return <>
    <div className="component-header">
      <div className="component-header-details">
        <h2>{ projectInfo?.name }</h2>
        <p onClick={() => ToggleEditProject()}>{projectEdit ? 'Back' : 'Edit'}</p>
      </div>

      <div className="component-header-breakdown">
      
      </div>

      <div className="component-header-actions">        
        <button onClick={() => navigate(`/log/projects/task/${project_id}/new`, { state: { belongsToProject: true, belongsToGoal: false  } })}>New Task</button>
      </div>

    </div>
    {projectEdit ? <EditProject ToggleEdit={ToggleEditProject} project={projectInfo} /> : 
      <ProjectBoard project={projectInfo} /> }
  </>
}