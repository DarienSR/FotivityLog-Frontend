import React, { useState } from "react";
import { DragAndDrop, Drag, Drop } from "../../dnd/drag-and-drop";
import { reorder, handleDragEnd } from "../../dnd/helper"
import useAuth from '../../../hooks/useAuth.js'
import { useGetProjectTasksQuery, useUpdateProjectTaskMutation} from "../api/projectTaskApiSlice";
import { useGetProjectsQuery } from "../api/projectApiSlice";
import EditProject from "./EditProject";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Task from "../ui/tasks/Task";
import "../../../App.css"
import { SettingOutlined } from '@ant-design/icons';
import Header from "../../modular/Header";
export const Project = (props) => {
  
  const { user_id } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const project_id =  pathname.split('/').slice(-1)[0]

  const [projectEdit, setProjectEdit] = useState(false)
  const [categories, setCategories] = useState(null);
  const [projectInfo, setProjectInfo] = useState(null)

  const { data: projectDetails, isSuccess: projectDetailsLoaded } = useGetProjectsQuery(`/projects/${user_id}?_id=${project_id}`, {
    // pollingInterval: 60000, // refresh data every minute
    refetchedOnFocus: true, // refresh data when window is focused again
    refetchOnMountOrArgChange: true
  })
  const { data: projectTasks, isSuccess: projectTasksLoaded } = useGetProjectTasksQuery(`/projects/${user_id}/${project_id}/tasks`, {
    // pollingInterval: 60000, // refresh data every minute
    refetchedOnFocus: true, // refresh data when window is focused again
    refetchOnMountOrArgChange: true
  })
  
  const [updateTask] = useUpdateProjectTaskMutation()

  // Functions used in setup
  function AssignTasksToColumns() {
    const { ids } = projectTasks
    // loop through ids and get the tasks
    for(let i = 0; i < ids.length; i++) {
      let task = projectTasks.entities[ids[i]];

  
      // task.stage is an integer reflecting the stage index
      // push task into the stage it is associated with
      stages[task.stage].items.push(task)
    }

    // prevent infinite re-render by only setting stages once (initial load)
    if(categories === null)
      return stages;
  }

  // TO DO: THIS SHOULD BE SET/LOADED IN THE PROJECT BACKEND
  let stages =  [ 
    { id: "0", name: "Under Consideration",items: [] },
    { id: "1", name: "Future", items: [] },
    { id: "2", name: "Queue", items: [] },
    { id: "3", name: "Under Development", items: [] },
    { id: "4", name: "Testing", items: []},
    { id: "5", name: "Finished", items: []}
  ]

  // both the project info and its associated tasks loaded
  if(projectDetailsLoaded && projectTasksLoaded) {
    const { ids } = projectDetails
    if(projectInfo === null)
      setProjectInfo(projectDetails.entities[ids[0]])
    if(categories === null)
      setCategories(AssignTasksToColumns())
  } else {
    <p>Create a task to get started</p>
  }

  // Functions used in render
  function UpdateTaskStage(task, newStage, updatedCategories) {
    task.stage = newStage
    updateTask(task)
    setCategories(updatedCategories);
  }

  function ToggleEditProject() {
    setProjectEdit(!projectEdit)
  }

  // Components used in render

  function CreateTask() {
    navigate(`/log/projects/task/${project_id}/new`);
  }

  const RenderProject = <>
      <Header 
        title = { projectInfo?.name }
        backText = "Edit"
        backAction = { ToggleEditProject }
        action = { CreateTask }
        actionText = 'Create Task'
        // cards = { [
        //   {
        //     text: 'Tasks working towards goals',
        //     x: 0,
        //     y: 0,
        //     cardBGColor: '#D326D7',
        //     circleBGColor: '#BB24BE',
        //   },
        //   {
        //     text: 'Tasks Completed',
        //     x: 1,
        //     y: 2,
        //     cardBGColor: '#29B2D0',
        //     circleBGColor: '#1197B5',
        //   },
        // ]}
      />



    <DragAndDrop onDragEnd={(result) => handleDragEnd(result, setCategories, UpdateTaskStage, categories)}>
      <Drop style={ styles.board } id="droppable" type="droppable-category">
        {categories?.map((category, categoryIndex) => {
          return (
            <div style={ styles.column }>
              <h2 style={styles.columnTitle}>{category.name}</h2>

              <Drop key={category.id} id={category.id} type="droppable-item">
                {category.items.map((item, index) => {
                  return (
                    <Task project={props.project} index={index} item={item} />
                  );
                })}
              </Drop>
            </div>
          );
        })}
      </Drop>
    </DragAndDrop>
  </>

  const EditProjectRender = <EditProject ToggleEdit={ToggleEditProject} project={projectInfo} /> 
  
  return <>
    { projectEdit ? EditProjectRender : RenderProject }
  </>
  
}

let styles = {
  board: {
    display: 'flex',
    minHeight: '80vh',
    backgroundColor: '#f9f8f8',
    color: '#080E01',
    borderRadius: '10px'
  },
  column: {
    backgroundColor: '#f9f8f8',
    boxShadow: '1px 2px 5px 1px #00000041',
    margin: "1rem",
    width: "16.666%",
    padding: "1rem",
    borderRadius: '10px'
  },
  columnTitle: {
    textAlign: 'center',
    borderBottom: '2px solid black',
  },
  item: {
    backgroundColor: 'rgb(233 229 229)',
    boxShadow: '2px 2px #b7b7b7',
    height: '10rem',
    padding: '1rem'
  }
}