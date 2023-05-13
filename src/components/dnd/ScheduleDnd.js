import React, { useState } from "react";
import { DragAndDrop, Drag, Drop } from "./drag-and-drop";
import { reorder } from "./helper"
import useAuth from '../../hooks/useAuth.js'
import { useGetScheduledTasksQuery, useUpdateTaskMutation } from "../Task/taskApiSlice";

import { Link, useNavigate, useLocation } from "react-router-dom"

export const ScheduleDnD = () => {
  const { id } = useAuth()
  const { pathname } = useLocation()
  let path =  pathname.split('/').slice(-1)[0]

  // Load data
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

let streaks = [
  { id: "0", name: "Streaks", items: [] },
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
    console.log("--->_", task)
    updateTask(task)
    setCategories(updatedCategories);
  }

  // Loop through data and assign to corresponding stage
  // if there is no stage assigned to task, then default should be under consideration

  const handleDragEnd = (result) => {
    const { type, source, destination } = result;
    if (!destination) return;

    const sourceCategoryId = source.droppableId;
    const destinationCategoryId = destination.droppableId;

    // Reordering items
    if (type === "droppable-item") {
      // If drag and dropping within the same category
      if (sourceCategoryId === destinationCategoryId) {
        const updatedOrder = reorder(
          categories.find((category) => category.id === sourceCategoryId).items,
          source.index,
          destination.index
        );
        const updatedCategories = categories.map((category) =>
          category.id !== sourceCategoryId
            ? category
            : { ...category, items: updatedOrder }
        );

        setCategories(updatedCategories);
      } else {
        const sourceOrder = categories.find(
          (category) => category.id === sourceCategoryId
        ).items;
        const destinationOrder = categories.find(
          (category) => category.id === destinationCategoryId
        ).items;

        const [removed] = sourceOrder.splice(source.index, 1);
        destinationOrder.splice(destination.index, 0, removed);

        destinationOrder[removed] = sourceOrder[removed];
        delete sourceOrder[removed];

        const updatedCategories = categories.map((category) =>
          category.id === sourceCategoryId
            ? { ...category, items: sourceOrder }
            : category.id === destinationCategoryId
            ? { ...category, items: destinationOrder }
            : category
        );
        let task = JSON.parse(JSON.stringify(destinationOrder[destination.index]))
        UpdateTaskStage(task, result.destination.droppableId, updatedCategories)


    




        

      }
    }

    // Reordering categories
    if (type === "droppable-category") {
      const updatedCategories = reorder(
        categories,
        source.index,
        destination.index
      );

      setCategories(updatedCategories);
    }
  };

  return (
    <DragAndDrop onDragEnd={handleDragEnd}>
      <Drop style={ styles.board } id="droppable" type="droppable-category">
        {categories.map((category, categoryIndex) => {
          return (
            <div style={ styles.column }>
              <h2 style={styles.columnTitle}>{category.name}</h2>

              <Drop key={category.id} id={category.id} type="droppable-item">
                {category.items.map((item, index) => {
                  return (
                    <Drag
                      className="draggable"
                      key={item.id}
                      id={item.id}
                      index={index}
                    >
                      <div style={styles.item}>{item.task}</div>
                    </Drag>
                  );
                })}
              </Drop>
            </div>
          );
        })}
      </Drop>
    </DragAndDrop>
  );
};

let styles = {
  board: {
    display: 'flex',
    minHeight: '80vh',
    backgroundColor: 'whitesmoke',
    width: '80%',
    flexWrap: 'wrap',
    margin: '1rem'
  },
  column: {
    margin: "1rem",
    width: '10%',
    padding: "1rem"
  },
  columnTitle: {
    textAlign: 'center',
    borderBottom: '2px solid black'
  },
  item: {
    backgroundColor: 'rgb(233 229 229)',
    boxShadow: '2px 2px #b7b7b7',
    height: '2rem',
    padding: '1rem',
  }
}
