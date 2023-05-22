import React, { useState } from "react";
import { DragAndDrop, Drag, Drop } from "./drag-and-drop";
import { reorder, handleDragEnd } from "./helper"
import useAuth from '../../hooks/useAuth.js'
import { useGetScheduledTasksQuery, useUpdateTaskMutation } from "../task/taskApiSlice";
import Task from "../task/Task";
import { Link, useNavigate, useLocation } from "react-router-dom"

export const ScheduleBoard = () => {
  const { user_id } = useAuth()

  const { pathname } = useLocation()
  let path =  pathname.split('/').slice(-1)[0]

  // Load data
  const {
    data: tasks,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetScheduledTasksQuery(user_id, {
    // pollingInterval: 60000, // refresh data every minute
    refetchedOnFocus: true, // refresh data when window is focused again
    refetchOnMountOrArgChange: true
  })

  const [updateTask] = useUpdateTaskMutation()


// Define the default stages
let week =  [ 
  { id: "0", name: "Monday", items: [] },
  { id: "1", name: "Tuesday", items: [] },
  { id: "2", name: "Wednesday", items: [] },
  { id: "3", name: "Thursday", items: [] },
  { id: "4", name: "Friday", items: []},
  { id: "5", name: "Saturday", items: []},
  { id: "6", name: "Sunday", items: []}
]


  const [categories, setCategories] = useState(null);


  if(isSuccess) {
    const { ids } = tasks
    // loop through ids and get the tasks
    for(let i = 0; i < ids.length; i++) {
      let task = tasks.entities[ids[i]];

     console.log(task)
      // task.stage is an integer reflecting the stage index
      // push task into the stage it is associated with
      week[task.stage].items.push(task)
    }

    // prevent infinite re-render by only setting stages once (initial load)
    if(categories === null)
      setCategories(week)
  } 
  
  if(categories === null) return


  function UpdateTaskStage(task, newStage, updatedCategories) {
    task.stage = newStage
    updateTask(task)
    setCategories(updatedCategories);
  }

  return (
    <>
      <DragAndDrop onDragEnd={(result) => handleDragEnd(result, setCategories, UpdateTaskStage, categories)}>
        <Drop style={ styles.board } id="droppable" type="droppable-category">
          {categories.map((category, categoryIndex) => {
            return (
              <div style={ styles.column }>
                <h2 style={styles.columnTitle}>{category.name}</h2>

                <Drop key={category.id} id={category.id} type="droppable-item">
                  {category.items.map((item, index) => {
                    return (
                      <Task index={index} item={item} />
                    );
                  })}
                </Drop>
              </div>
            );
          })}
        </Drop>
      </DragAndDrop>
    </>
  );
};

let styles = {
  board: {
    display: 'flex',
    minHeight: '80vh',
    justifyContent: 'center',
    width: '100%',
    flexWrap: 'wrap',
    borderRadius: '1rem',
    margin: "1rem",
  },
  column: {
    margin: "1rem",
    width: '10%',
    padding: "1rem",
  },
  columnTitle: {
    textAlign: 'center',
    borderBottom: '2px solid black'
  },
  item: {
    boxShadow: '2px 2px #b7b7b7',
    height: '2rem',
    padding: '1rem',
    width: '100%'
  }
}
