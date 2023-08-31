import { useGetScheduledTasksQuery } from '../api/scheduleApiSlice'
import useAuth from '../../../hooks/useAuth.js'
import { Link, useNavigate, useLocation } from "react-router-dom"
import "../../../App.css"
import { Badge, Calendar, Radio } from 'antd';
import { useState, useEffect } from "react"
import { Modal, Timeline } from 'antd';
import { CloseCircleFilled, CheckCircleFilled, CloseCircleOutlined, CheckCircleOutlined, PaperClipOutlined, BookOutlined  } from '@ant-design/icons';
import { useUpdateScheduledTaskMutation } from "../api/scheduleApiSlice"
import EditScheduledTask from './EditScheduledTask';

const RenderTimeline = (props) => {
  const navigate = useNavigate()
  const { user_id } = useAuth()
  let { state, pathname } = useLocation();


  const [timelineData, setTimelineData] = useState([]);
  const [updateTask] = useUpdateScheduledTaskMutation();
  const [showEditScheduledTask, setShowEditScheduledTask] = useState(false);
  const [editScheduledTaskData, setEditScheduledTaskData] = useState([]);

  const date = pathname.split('/').slice(-1)[0]

  const { data: tasks, isSuccess } = useGetScheduledTasksQuery(`/schedule/tasks/${user_id}?scheduled_for=${date}`)
  if(!isSuccess) return;
  
  const { ids } = tasks
  let selectedTasks = []
  // loop through ids and get the tasks
  for(let i = 0; i < ids.length; i++) {
    selectedTasks.push({
      id: tasks.entities[ids[i]].id,
      type: tasks.entities[ids[i]].tag || [],
      content: tasks.entities[ids[i]].task,
      data: tasks.entities[ids[i]]
    })
  }

  function ToggleViewTask(e) {
    props.HideParentHeader();
    setShowEditScheduledTask(!showEditScheduledTask);
    setEditScheduledTaskData(e.data);
  }

  function RenderContainer(task) {
    return <>
      <div onClick={() =>  ToggleViewTask(task) } className="task-schedule">
        <div className='task-schedule-top'>
          <h3>{ task.data.task }</h3>

          <div className='task-schedule-top-details'>
            <span><PaperClipOutlined /> {task.data.links?.length}</span>
            <span><BookOutlined /> {task.data.notes?.length}</span>
          </div>
        </div>

        <div className='task-schedule-middle'>
          <p>{ task.data.desc !== ''  ? `${task.data.desc}` : null}</p>
       </div>
      </div>
    </>
  }

  function RenderLabel(task) {
      return <p style={{ fontWeight: 'bold', marginRight: '1rem' }}>
        {task.data.time_start} - {task.data.time_finish}
      </p>
  }

  function RenderCompleted(task) {
    return task.data.completed ? <CheckCircleFilled onClick={() => ToggleTaskCompleted(task.data)} style={{fontSize: "2rem", backgroundColor: '#F9F8F8'}} /> : <CloseCircleFilled onClick={() => ToggleTaskCompleted(task.data)} style={{fontSize: "2rem",  backgroundColor: '#F9F8F8'}} />
  }

  async function ToggleTaskCompleted(task) {
    let res = await updateTask({ ...task, completed: !task.completed, completed_on: new Date() })
    let updatedTask = res.data.response.updated;
    
    const index = timelineData.map(function(e) { return e.id; }).indexOf(updatedTask._id);
    let newArray = [...timelineData];
    
    newArray[index] = {
      color: updatedTask.completed ? 'green' : 'red',
      children: RenderContainer({ data: updatedTask}),
      label: RenderLabel({ data: updatedTask}),
      dot: RenderCompleted({ data: updatedTask}),
      assigned: (updatedTask.time_start === null || updatedTask.time_start === '') ? false : true,
      task: updatedTask,
    } 

    navigate('.', {state: { date }})
  }


  const data = [];
  selectedTasks?.forEach((task) => {
    data.push({
      color: task.data.completed ? 'green' : 'red',
      children: RenderContainer(task),
      label: RenderLabel(task),
      dot: RenderCompleted(task),
      assigned: !(task.data.time_start === null || task.data.time_start === ''),
      task: task.data,
      id: task.data._id
    });
  });

  const assigned = data?.filter((task) => {
    return task.assigned;
  })

  const unassigned = data?.filter((task) => {
    return !task.assigned;
  })


  function ToggleEditView() {
    props.HideParentHeader();
    setShowEditScheduledTask(!showEditScheduledTask)
  }

  return showEditScheduledTask ? <EditScheduledTask toggleView={ ToggleEditView }  data={editScheduledTaskData} /> : <div style={{ padding: '2rem' }} className="body">

      <Timeline
        mode="left"
        items={assigned}
      /> 

      <div style={{paddingLeft: '3rem'}}>
        {unassigned.length > 0 ? <h3>Unassigned Tasks</h3> : ''}
        { unassigned?.map((task) => {
          return task.children;          
        }) }      
      </div>
    </div>
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

export default RenderTimeline;