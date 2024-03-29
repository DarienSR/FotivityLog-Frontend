
import { useGetScheduledTasksQuery } from '../api/scheduleApiSlice'
import useAuth from '../../../hooks/useAuth.js'
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Badge, Calendar, Timeline, Radio } from 'antd';
import { useState } from "react"
import ViewTask from "../../projects/ui/tasks/ViewTask";
import { Modal } from 'antd';
import "../../../App.css"
import { CloseCircleFilled, CheckCircleFilled  } from '@ant-design/icons';

import RenderTimeline from './RenderTimeline'
const Schedule = () => {
  const { user_id } = useAuth()
  const { data, isSuccess } = useGetScheduledTasksQuery(`/schedule/tasks/${user_id}`)
  const navigate = useNavigate()
  const [value, setValue] = useState();
  let tasks = []

  let panelChange = false;
  const onPanelChange = (newValue) => {
    panelChange = true;
    setValue(newValue);
  };

  function NavigateToTimeline(value) {
    if(panelChange) return;

    let date = value.$d.toISOString().split('T')[0]
    alert(date)
    navigate(`./timeline/${date}`)
  }

  if(isSuccess && data) {
    const { ids } = data
    // loop through ids and get the tasks
    for(let i = 0; i < ids.length; i++) {
      let obj = {
        id: data.entities[ids[i]].id,
        type: data.entities[ids[i]].tag || [],
        content: data.entities[ids[i]].task,
        data: data.entities[ids[i]]
      }
      tasks.push(obj);
    }

  
  
    if(tasks.length <= 0) return;
  
  
    const dateCellRender = (value) => {
      // filter based on day scheduled
      const listData = tasks.filter((task) => {
        return value.$d.toISOString().split('T')[0] === task.data.scheduled_for
      });
  
      return (
        <ul className="events">
          {listData.reverse().map((item) => (
            <li key={item.content}>
              <Badge status={item.data.completed ? 'success' : 'processing'} text={item.content} />
            </li>
          ))}
        </ul>
      );
    };
  
    const cellRender = (current, info) => {
      return dateCellRender(current);
    };
  
  

  
    return (
      <>
        
        <div className='fotivity-container'>
          <h1>Schedule</h1>
          <button onClick={() => navigate("./task/create",  { state: { belongsToProject: null, belongsToGoal: null } })}>Create Task</button>
  
          
          <Calendar mode={"month"} value={value} onPanelChange={onPanelChange} onSelect={NavigateToTimeline} cellRender={cellRender} />;
        </div>
        
      </>
    )
  } else {
    return (
      <>
        
        <div className='fotivity-container'>
          <h1>Schedule</h1>
          <button onClick={() => navigate("./task/create",  { state: { belongsToProject: null, belongsToGoal: null } })}>Create Task</button>

          <Calendar  mode={"month"} value={value}  onPanelChange={onPanelChange} />;
        </div>
        
      </>
    )
  }
}

export default Schedule
