import { Card, Modal } from 'antd';
import ViewTask from "./ViewTask";
import React, { useState } from "react";
import { DragAndDrop, Drag, Drop } from "../dnd/drag-and-drop";
import { PaperClipOutlined, BookOutlined } from '@ant-design/icons';
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
  console.log('prop', props)
  let tagColor = props.item.tag?.color

  return (
    <>
      <Drag
        className="draggable"
        key={props.item.id}
        id={props.item.id}
        index={props.index}
        value={props.item.value}
      >
      <div style={styles.task} onClick={() => ToggleTaskModal(props.item)}>
        <p style={{margin: 0, height: '3rem', fontSize: '1.1rem'}}> {props.item.task} </p>
        <div style={styles.info}>
          <span><PaperClipOutlined /> {props.item.links.length}</span>
          <span><BookOutlined /> {props.item.notes.length}</span>
         <div style={{backgroundColor: tagColor || null, height: '1.5rem', width: '4rem', display: 'flex', alignSelf: 'flex-end'}} title={props.item.tag?.name}></div>
        </div>
      </div>
      </Drag>
      {
        toggleTaskModal ? <>
            <Modal
              open={toggleTaskModal}
              onOk={UpdateTask}
              onCancel={ToggleTaskModal}
              cancelButtonProps={{ style: { display: 'none'} }}
              okButtonProps={{ style: { display: 'none'} }}
            >
              <ViewTask item={taskModalData} />
            </Modal>
        </> : null
      }
    </>
  )
}

let styles = {
  task: {
    backgroundColor: '#ffeaea',
    padding: '1rem',
    height: '5rem',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0px 2px 2px 0px gray'
  },
  info: {
    display: 'flex',
    fontSize: '1.2rem',
    justifyContent: 'space-around'
  }
}