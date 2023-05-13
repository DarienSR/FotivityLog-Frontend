import React, { useState } from "react";
import { DragAndDrop, Drag, Drop } from "./drag-and-drop";
import { reorder } from "./helper"
import useAuth from '../../hooks/useAuth.js'
import { useGetProjectTasksQuery } from "../Task/taskApiSlice";
import { Link, useNavigate, useLocation } from "react-router-dom"
export const NestedListComponent = () => {
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
  } = useGetProjectTasksQuery({user: id, path}, {
    // pollingInterval: 60000, // refresh data every minute
    refetchedOnFocus: true, // refresh data when window is focused again
    refetchOnMountOrArgChange: true
  })


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

        setCategories(updatedCategories);
        console.log(`Source: ${result.source.droppableId}, Destination: ${result.destination.droppableId}, Item: ${destinationOrder[destination.index].name}`)
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
  },
  column: {
    backgroundColor: 'whitesmoke',
    boxShadow: '2px 1px 3px 2px #dddbaa',
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
