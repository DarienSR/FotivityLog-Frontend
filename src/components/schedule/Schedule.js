import '../../App.css'
import { useGetScheduledTasksQuery } from '../task/taskApiSlice'
import useAuth from '../../hooks/useAuth.js'
import { Link, useNavigate, useLocation } from "react-router-dom"
import "../../App.css"
import { Badge, Calendar, Timeline, Radio } from 'antd';
import { useState } from "react"
import ViewTask from "../task/ViewTask";
import { Modal } from 'antd';
import { genComponentStyleHook } from 'antd/es/theme/internal'




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
        type: data.entities[ids[i]].tag || [],
        content: data.entities[ids[i]].task,
        data: data.entities[ids[i]]
      }

      tasks.push(obj);
    }

  }
  const [mode, setMode] = useState('left');
  const onChange = (e) => {
    setMode(e.target.value);
  };


  const [value, setValue] = useState();
  const [selectedValue, setSelectedValue] = useState();
  const [toggleTaskModal, setToggleTaskModal] = useState(false);
  const [taskModalData, setTaskModalData] = useState(null)

  const [showSelectedTask, setShowSelectedTask] = useState(false);
  const [selectedTaskData, setSelectedTaskData] = useState();

  let panelChange = false;
  function ToggleTaskModal(data) {
    setTaskModalData(data)
    setToggleTaskModal(!toggleTaskModal)
  }


  function ShowSelectedTask(e) {
    setShowSelectedTask(!showSelectedTask)
    setSelectedTaskData(e)
  }

  const onSelect = (newValue) => {
    if(panelChange === false) {
      let data = tasks.filter((task) => {
        return newValue.$d.toISOString().split('T')[0] === task.data.scheduled_for
      });
        

      
      let timelineItems = []
      let unassignedItems = []
      data.forEach((task) => {
        let timelineRender  = <button onClick={() => ShowSelectedTask(task.data)}>
          { task.data.task }
        </button>


        if(task.data.timeStart === undefined)
          unassignedItems.push(task.data)
        else
          timelineItems.push({ color: task.data.completed ? 'green' : 'red', label: `${task.data.timeStart} - ${task.data.timeFinish}`, children: timelineRender, data: task.data })
      })

      ToggleTaskModal({ timelineItems, unassignedItems })
      setValue(newValue);
      setSelectedValue(newValue);
    }
    panelChange = false;
  };


  const onPanelChange = (newValue) => {
    panelChange = true;
    setValue(newValue);
  };
  const navigate = useNavigate()


  let content;

  if(tasks.length <= 0) return;


  const dateCellRender = (value) => {
    // filter based on day scheduled
    const listData = tasks.filter((task) => {
      return value.$d.toISOString().split('T')[0] === task.data.scheduled_for
    });

    return (
      <ul className="events">
        {listData.map((item) => (
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
      {
        toggleTaskModal ? <>
            <Modal
              open={toggleTaskModal}
              onCancel={ToggleTaskModal}
              cancelButtonProps={{ style: { display: 'none'} }}
              okButtonProps={{ style: { display: 'none'} }}
              width={"60%"}
            >
                <button onClick={() => navigate("./task/create",  { state: { belongsToProject: null, belongsToGoal: null, selectedDate: selectedValue?.format('YYYY-MM-DD')  } })}>Create Task</button>
              <div>
                <Timeline
                  mode="left"
                  items={taskModalData?.timelineItems}
                />

                {
                  taskModalData?.unassignedItems.map((task) => {
                    return <p onClick={() => ShowSelectedTask(task)}>{task.task}</p>
                  })
                }
              </div>

              { showSelectedTask ? <ViewTask belongsToGoal={false} belongsToProject={false} item={selectedTaskData} /> : null }
            </Modal>
        </> :   <div className='fotivity-container'>
            <h1>Schedule</h1>
            <button onClick={() => navigate("./task/create",  { state: { belongsToProject: null, belongsToGoal: null } })}>Create Task</button>
          
            <Calendar mode={"month"} value={value} onSelect={onSelect} onPanelChange={onPanelChange} cellRender={cellRender} />;
          </div>
      }
    </>
  )
}

export default Schedule
