import React, { useState } from "react";
import { DragAndDrop, Drag, Drop } from "./drag-and-drop";
import { reorder } from "./helper"

export const NestedListComponent = () => {
  const [categories, setCategories] = useState([
    {
      id: "Future",
      name: "Future",
      items: [
        { id: "abc", name: "First" },
        { id: "def", name: "Second" }
      ]
    },
    {
      id: "Queue",
      name: "Queue",
      items: [
        { id: "ghi", name: "Third" },
        { id: "jkl", name: "Fourth" }
      ]
    },
    {
      id: "Under Development",
      name: "Under Development",
      items: [],
    },
    {
      id: "Testing",
      name: "Testing",
      items: [],
    },
    {
      id: "Finished",
      name: "Finished",
      items: [],
    },
    {
      id: "Under Consideration",
      name: "Under Consideration",
      items: [],
    },
  ]);

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
                      <div style={styles.item}>{item.name}</div>
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
