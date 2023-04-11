// Here we can have banners, footers, etc that can span the entire page regardless of public/private view.
import { Outlet } from 'react-router-dom'
import Navbar from './navigation/Navbar'
const Layout = () => {

  return <>
    <Navbar />
    <Outlet />
  </>
  
  
}

export default Layout