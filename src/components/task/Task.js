import { Card, Modal } from 'antd';
import EditTask from "./EditTask";
import React, { useState } from "react";
import { DragAndDrop, Drag, Drop } from "../dnd/drag-and-drop";
import { PaperClipOutlined, BookOutlined } from '@ant-design/icons';
import "../../App.css"
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

  let tagColors = props.item.tags?.map((tag) => {
   return  <div style={{backgroundColor: tag.color || null, maxHeight: '1.5rem', minWidth: '4rem', display: 'flex', justifyContent: 'center', fontSize: '0.8rem', marginLeft: '0.35rem', borderRadius: '10px', padding: '0.2rem'}} title={tag.name}><p style={{ marginTop: '0.25rem' }}>{tag.name.toUpperCase()}</p></div>
  })

  return (
    <>
      <Drag
        className="draggable"
        key={props.item.id}
        id={props.item.id}
        index={props.index}
        value={props.item.value}
      >
      <div className="task" onClick={() => ToggleTaskModal(props.item)}>
        <div style={{ display: 'flex', marginBottom: '0.2rem' }}>
          { tagColors }
        </div>
        <p style={{margin: 0, height: '3rem', fontSize: '1.1rem'}}> {props.item.task} </p>
        <div style={styles.info}>
          <span><PaperClipOutlined /> {props.item.links.length}</span>
          <span><BookOutlined /> {props.item.notes.length}</span>
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
              width={"60%"}
            >
              <EditTask toggleModal={ToggleTaskModal} data={props.item} /> 
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