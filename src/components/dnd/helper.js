export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};


export const handleDragEnd = (result, setCategories, UpdateTaskStage, categories) => {
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
}