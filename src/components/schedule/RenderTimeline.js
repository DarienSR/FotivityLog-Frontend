import '../../App.css'
import { useGetScheduledTasksQuery } from '../task/taskApiSlice'
import useAuth from '../../hooks/useAuth.js'
import { Link, useNavigate, useLocation } from "react-router-dom"
import "../../App.css"
import { Badge, Calendar, Radio } from 'antd';
import { useState, useEffect } from "react"
import ViewTask from "../task/ViewTask";
import { Modal, Timeline } from 'antd';
import "../../App.css"
import { CloseCircleFilled, CheckCircleFilled, CloseCircleOutlined, CheckCircleOutlined, PaperClipOutlined, BookOutlined  } from '@ant-design/icons';
import { useUpdateTaskMutation } from '../task/taskApiSlice'

const RenderTimeline = (props) => {
  const navigate = useNavigate()
  let { state } = useLocation();
  const [timelineData, setTimelineData] = useState([]);
  const [updateTask] = useUpdateTaskMutation()


  function ToggleViewTask(e) {
    alert(e.data.task);
  }

  function RenderContainer(task) {
    let tagColors = task.data.tags?.map((tag) => {
      return  <span style={{backgroundColor: tag.color || null, maxHeight: '1.5rem', minWidth: '4rem', maxWidth: '5rem', display: 'flex', justifyContent: 'center', fontSize: '0.8rem', marginLeft: '0.35rem', fontWeight: 'bold', borderRadius: '10px', padding: '0.2rem', color: 'white'}} title={tag.name}>
        {tag.name.toUpperCase()}
      </span>
     })

    return <>
      <div onClick={() =>  ToggleViewTask(task) } className="task-schedule">
        <div className='task-schedule-left'>
          <div>
            { tagColors }
          </div>
          <span>
            {task.data.completed ? <CheckCircleOutlined title="Mark as Complete" onClick={() => ToggleTaskCompleted(task.data)} style={{fontSize: "2rem"}} />  : <CloseCircleOutlined title="Mark as To do" onClick={() => ToggleTaskCompleted(task.data)} style={{fontSize: "2rem"}} /> }
          </span>
        </div>

        <div className='task-schedule-middle'>
          <h3 onClick={() => {}}>{ task.data.task }</h3>
          <p>{ task.data.desc !== ''  ? `${task.data.desc}` : null}</p>
       </div>

        <div className='task-schedule-right'>
          <span><PaperClipOutlined /> {task.data.links.length}</span>
          <span><BookOutlined /> {task.data.notes.length}</span>
        </div>
      </div>
    </>
  }

  function RenderLabel(task) {
      return <p style={{ fontWeight: 'bold', marginRight: '1rem' }}>
        {task.data.timeStart} - {task.data.timeFinish}
      </p>
  }

  function RenderCompleted(task) {
    return task.data.completed ? <CheckCircleFilled onClick={() => ToggleTaskCompleted(task.data)} style={{fontSize: "2rem"}} /> : <CloseCircleFilled onClick={() => ToggleTaskCompleted(task.data)} style={{fontSize: "2rem"}} />
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
      assigned: updatedTask.timeStart === undefined ? false : true,
      task: updatedTask,
    } 

    navigate('../')
  }

  useEffect(() => {
    const data = [];
    state?.data?.forEach((task) => {
      data.push({
        color: task.data.completed ? 'green' : 'red',
        children: RenderContainer(task),
        label: RenderLabel(task),
        dot: RenderCompleted(task),
        assigned: task.data.timeStart === undefined ? false : true,
        task: task.data,
        id: task.data._id
      });
    });
    console.log(data)
    setTimelineData(data);
  }, [])

  const assigned = timelineData?.filter((task) => {
    return task.assigned;
  })

  const unassigned = timelineData?.filter((task) => {
    return !task.assigned;
  })


  return (
    <>
      <div className="component-header">
        <div className="component-header-details">
          <h2>{state?.date}</h2>
          <p onClick={ () => navigate("../")}>Back</p>
        </div>

        <div className="component-header-breakdown">

        </div>

        <div className="component-header-actions">        
        <button className="button-primary" onClick={() => navigate("/log/schedule/task/create",  { state: { belongsToProject: null, belongsToGoal: null, selectedDate: state?.info } })}>Create Task</button>
        </div>
      </div>

     <br />
      
      <Timeline
        mode="left"
        items={assigned}
      /> 

      <div style={{paddingLeft: '3rem'}}>
        <h3>Unassigned Tasks</h3>
        { unassigned?.map((task) => {
          return task.children;          
        }) }      
      </div>
     
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

export default RenderTimeline;