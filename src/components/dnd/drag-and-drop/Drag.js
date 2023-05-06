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
    backgroundColor: 'rgb(171 171 171)',
    boxShadow: '2px 1px 2px 1px #b7b7b7',
    height: '1.5rem',
    marginTop: '1rem'
  }
}