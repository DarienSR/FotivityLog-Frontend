import '../../App.css'
import { useGetScheduledTasksQuery } from '../task/taskApiSlice'
import useAuth from '../../hooks/useAuth.js'
import { Link, useNavigate, useLocation } from "react-router-dom"
import "../../App.css"
import { Alert, Badge, Calendar } from 'antd';
import { useState } from "react"





const getMonthData = (value) => {
  if (value.month() === 8) {
    return 1394;
  }
};

const Schedule = () => {
  const { user_id } = useAuth()
    // Load data
    const {
    data,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetScheduledTasksQuery(user_id, {
    // pollingInterval: 60000, // refresh data every minute
    refetchedOnFocus: true, // refresh data when window is focused again
    refetchOnMountOrArgChange: true
  })



  let tasks = []
  if(isSuccess) {
    const { ids } = data
    // loop through ids and get the tasks
    for(let i = 0; i < ids.length; i++) {
      let obj = {
        id: data.entities[ids[i]].id,
        type: data.entities[ids[i]].tag,
        content: data.entities[ids[i]].task,
        data: data.entities[ids[i]]
      }

      tasks.push(obj);
    }

    console.log("load: ", tasks)
  }


  const [value, setValue] = useState();
  const [selectedValue, setSelectedValue] = useState();
  const onSelect = (newValue) => {
    setValue(newValue);
    setSelectedValue(newValue);
  };
  const onPanelChange = (newValue) => {
    setValue(newValue);
  };
  const navigate = useNavigate()


  let content;

  if(tasks.length <= 0) return;

  const monthCellRender = (value) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };
  const dateCellRender = (value) => {
    // filter based on day scheduled
    const listData = tasks.filter((task) => {
      return value.$d.toISOString().split('T')[0] === task.data.scheduled_for
    });

    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };
  const cellRender = (current, info) => {
    console.log(info)
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };
  return (
    <div className='fotivity-container'>
      <h1>Schedule</h1>
      <button onClick={() => navigate("./task/create",  { state: { belongsToProject: false, belongsToGoal: false } })}>Create Task</button>
      <Alert message={`You selected date: ${selectedValue?.format('YYYY-MM-DD')}`} />
      <Calendar value={value} onSelect={onSelect} onPanelChange={onPanelChange} cellRender={cellRender} />;

    </div>
  )
}

export default Schedule
