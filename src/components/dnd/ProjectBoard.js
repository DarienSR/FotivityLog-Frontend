import React, { useState } from "react";
import { DragAndDrop, Drag, Drop } from "./drag-and-drop";
import { reorder, handleDragEnd } from "./helper"
import useAuth from '../../hooks/useAuth.js'
import { useGetProjectTasksQuery, useUpdateTaskMutation} from "../task/taskApiSlice";
import { Link, useNavigate, useLocation } from "react-router-dom"
import Task from "../task/Task";
export const ProjectBoard = (props) => {
  const { user_id } = useAuth()
  const { pathname, state } = useLocation()
  let path =  pathname.split('/').slice(-1)[0]

  // Load data
  const {
    data: tasks,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetProjectTasksQuery({user: user_id, path}, {
    // pollingInterval: 60000, // refresh data every minute
    refetchedOnFocus: true, // refresh data when window is focused again
    refetchOnMountOrArgChange: true
  })


  const [updateTask] = useUpdateTaskMutation()

// Define the default stages
let stages =  [ 
  { id: "0",name: "Under Consideration",items: [] },
  { id: "1", name: "Future", items: [] },
  { id: "2", name: "Queue", items: [] },
  { id: "3", name: "Under Development", items: [] },
  { id: "4", name: "Testing", items: []},
  { id: "5", name: "Finished", items: []}
]

  const [categories, setCategories] = useState(null);

  if(isSuccess) {
    const { ids } = tasks
    // loop through ids and get the tasks
    for(let i = 0; i < ids.length; i++) {
      let task = tasks.entities[ids[i]];

   
      // task.stage is an integer reflecting the stage index
      // push task into the stage it is associated with
      stages[task.stage].items.push(task)
    }


    // prevent infinite re-render by only setting stages once (initial load)
    if(categories === null)
      setCategories(stages)
  } 
  
  if(categories === null) return


  function UpdateTaskStage(task, newStage, updatedCategories) {
    task.stage = newStage
    updateTask(task)
    setCategories(updatedCategories);
  }

  return (
    <>
    {
        <DragAndDrop onDragEnd={(result) => handleDragEnd(result, setCategories, UpdateTaskStage, categories)}>
          <Drop style={ styles.board } id="droppable" type="droppable-category">
            {categories.map((category, categoryIndex) => {
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
    }
    </>
  );
};

let styles = {
  board: {
    display: 'flex',
    minHeight: '80vh',
  },
  column: {
    backgroundColor: '#FEF7F7',
    boxShadow: '1px 2px 5px 1px #938585',
    margin: "1rem",
    width: "16.666%",
    padding: "1rem"
  },
  columnTitle: {
    textAlign: 'center',
    borderBottom: '2px solid black'
  },
  item: {
    backgroundColor: 'rgb(233 229 229)',
    boxShadow: '2px 2px #b7b7b7',
    height: '10rem',
    padding: '1rem'
  }
}
