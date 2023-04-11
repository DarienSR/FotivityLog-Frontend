import { Outlet } from 'react-router-dom'
import '../App.css'
const FotivityLog = () => {
  return (
   <>
   {/* <p>This will be alerts / banners</p> */}
    <div className='fotivity-container'>
      <Outlet />
    </div>
   </>
  )
}

export default FotivityLog
