import { Draggable } from "react-beautiful-dnd";

export const Drag = ({ id, index, ...props }) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => {
        return (
          <div ref={provided.innerRef} {...provided.draggableProps} {...props}>
            <div style={styles.handle} {...provided.dragHandleProps}>
             <p style={styles.value}>{props.value}</p> 
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
    backgroundColor: 'rgb(255 100 100)',
    height: '1.5rem',
  },
  value: {
    float: 'right',
    margin: 0,
    paddingRight: '0.5rem'
  }
}