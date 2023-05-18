import { Draggable } from "react-beautiful-dnd";

export const Drag = ({ id, index, ...props }) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => {
        return (
          <div ref={provided.innerRef} {...provided.draggableProps} {...props}>
            <div style={styles.handle} {...provided.dragHandleProps}>

            </div>
            {props.children}
          </div>
        );
      }}
    </Draggable>
  );
};

let styles = {
  handle: {
    backgroundColor: 'black',
    height: '1.25rem',
    borderRadius: '1rem 1rem 0rem 0rem'
  }
}