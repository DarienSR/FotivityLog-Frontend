import { Card, Modal } from 'antd';
import EditTask from "../Task/EditTask";
import React, { useState } from "react";
import { DragAndDrop, Drag, Drop } from "../dnd/drag-and-drop";
export default function Task(props) {

  const [toggleTaskModal, setToggleTaskModal] = useState(false);
  const [taskModalData, setTaskModalData] = useState(null)

  function ToggleTaskModal(task) {
    setToggleTaskModal(!toggleTaskModal)
    setTaskModalData(task)
  }

  function UpdateTask() {
    setToggleTaskModal(!toggleTaskModal)
  }

  return (
    <>
      <Drag
        className="draggable"
        key={props.item.id}
        id={props.item.id}
        index={props.index}
      >
      <div style={{background: 'white', height: '5rem', padding: '1rem', boxShadow: '0px 2px 5px 2px gray', borderRadius: '0rem 0rem 1rem 1rem'}} onClick={() => ToggleTaskModal(props.item)}>
        <p style={{margin: 0}}> {props.item.task} </p>
      </div>
      </Drag>
      {
        toggleTaskModal ? <>
            <Modal
              title="Basic Modal"
              open={toggleTaskModal}
              onOk={UpdateTask}
              onCancel={ToggleTaskModal}
              cancelButtonProps={{ style: { display: 'none'} }}
              okButtonProps={{ style: { display: 'none'} }}
            >
              <EditTask item={taskModalData} />
            </Modal>
        </> : null
      }
    </>
  )
}