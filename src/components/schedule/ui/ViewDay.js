import RenderTimeline from "./RenderTimeline";
import Header from "../../modular/Header";
import { useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"


export default function ViewDay() {

  let { pathname } = useLocation();
  const navigate = useNavigate()
  const date = pathname.split('/').slice(-1)[0]
  const [hideHeader, setHideHeader] = useState(true);

  function BackClick() {
    navigate(-1);
  }

  function CreateTask() {
    navigate("/log/schedule/task/create");
  }


 function HideHeader() {
  setHideHeader(!hideHeader);
 }

  return (
    <>
      { hideHeader ? <Header 
        title = { date }
        backText = "Back"
        backAction = { BackClick }
        action = { CreateTask }
        actionText = 'Create Task'
        cards = { [
          {
            text: 'Tasks working towards goals',
            x: 0,
            y: 0,
            cardBGColor: '#D326D7',
            circleBGColor: '#BB24BE',
          },
          {
            text: 'Tasks Completed',
            x: 1,
            y: 2,
            cardBGColor: '#29B2D0',
            circleBGColor: '#1197B5',
          },
        ] }
      /> : null }

      <div style={{backgroundColor: 'white',borderRadius: '10px'}}>
        <RenderTimeline HideParentHeader={HideHeader} />
      </div>
    </>
  )
}