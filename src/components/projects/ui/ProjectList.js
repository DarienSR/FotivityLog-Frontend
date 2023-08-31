import React, { useState } from "react";
// List all of the users projects
import { useGetProjectsQuery } from "../api/projectApiSlice";
import useAuth from '../../../hooks/useAuth.js'
import "../../../App.css"
import { Link, useNavigate, useLocation } from "react-router-dom"
export default function ProjectList() {

  // get users projects
  const { user_id } = useAuth()

  const navigate = useNavigate()
  const {
    data: tasks,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetProjectsQuery(`/projects/${user_id}`, {
    // pollingInterval: 60000, // refresh data every minute
    refetchedOnFocus: true, // refresh data when window is focused again
    refetchOnMountOrArgChange: true
  })

  let projects = null

  if(isSuccess) {
    const { ids } = tasks;
    projects = ids.map((id) => {
      return <div style={styles.projectContainer}>
          <p style={styles.project} onClick={() => navigate(`/log/projects/${tasks.entities[id].id}`, {state: { project: tasks.entities[id] }})}>
            {tasks.entities[id].name}
          </p>
        </div>
    })
  }

  // ability to create projects here.
  return <div style={styles.container}>
    <div style={{display: 'flex'}}>
      { projects }
    </div>
  
    <button className="button-primary" onClick={ () => navigate("/log/projects/create") }>New Project</button>
  </div>
}

let styles = {
  container: {
    width: '80%',
    margin: '0 auto'
  },
  projectContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  project: {
    borderRadius: '10px',
    boxShadow: '0 4px 4px #00000041',
    padding: '4rem',
    fontSize: '2.5rem',
    width: '15rem',
    textAlign: 'center',
    margin: '1rem',
    cursor: 'pointer'
  }
}