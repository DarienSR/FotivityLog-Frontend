import '../../App.css'
import { useGetScheduledTasksQuery } from '../task/taskApiSlice'
import useAuth from '../../hooks/useAuth.js'
import { Link, useNavigate, useLocation } from "react-router-dom"
import "../../App.css"
import { Badge, Calendar } from 'antd';
import { useState } from "react"
import ViewTask from "../task/ViewTask";
import { Modal } from 'antd';



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

  }


  const [value, setValue] = useState();
  const [selectedValue, setSelectedValue] = useState();
  const [toggleTaskModal, setToggleTaskModal] = useState(false);
  const [taskModalData, setTaskModalData] = useState(null)

  
  let panelChange = false;
  function ToggleTaskModal(task) {
    setTaskModalData(task)
    setToggleTaskModal(!toggleTaskModal)
  }

  const onSelect = (newValue) => {
    if(panelChange === false) {
      let data = tasks.filter((task) => {
        return newValue.$d.toISOString().split('T')[0] === task.data.scheduled_for
      });
        
      ToggleTaskModal(data)
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
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };
  const cellRender = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return null;
    return info.originNode;
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
              <div>
                {taskModalData.map((e) => {
                  return <ViewTask item={e.data} />
                })
                  
                }
              </div>

              <button onClick={() => navigate("./task/create",  { state: { belongsToProject: false, belongsToGoal: false, selectedDate: selectedValue?.format('YYYY-MM-DD')  } })}>Create Task</button>
            </Modal>
        </> :   <div className='fotivity-container'>
            <h1>Schedule</h1>
            <button onClick={() => navigate("./task/create",  { state: { belongsToProject: false, belongsToGoal: false } })}>Create Task</button>
          
            <Calendar mode={"month"} value={value} onSelect={onSelect} onPanelChange={onPanelChange} cellRender={cellRender} />;
          </div>
      }
    </>
  )
}

export default Schedule
