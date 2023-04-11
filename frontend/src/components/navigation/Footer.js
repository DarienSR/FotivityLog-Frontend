import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
const Footer = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
 
  const content = (
    <footer className='footer'>
      <p>Contact</p>
      <p>About</p>
    </footer>
  )

  return content
}

export default Footer