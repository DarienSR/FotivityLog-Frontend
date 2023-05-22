import React, { useState } from "react";
// List all of the users projects
import { useGetAllProjectsQuery } from "./projectApiSlice";
import useAuth from '../../hooks/useAuth.js'
import "../../App.css"
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
  } = useGetAllProjectsQuery(user_id, {
    // pollingInterval: 60000, // refresh data every minute
    refetchedOnFocus: true, // refresh data when window is focused again
    refetchOnMountOrArgChange: true
  })

  let projects = null

  if(isSuccess) {
    const { ids } = tasks;
    projects = ids.map((id) => {
      return <div>
          <button onClick={() => navigate(`/log/projects/${tasks.entities[id].id}`)}>
            {tasks.entities[id].name}
          </button>
        </div>
    })
    console.log(projects)
  }

  // ability to create projects here.
  return (
    <div className="fotivity-container">
      <p>List all projects associated with the user</p>
      { projects }
      <button onClick={ () => navigate("/log/projects/create") }>New Project</button>
    </div>
  )
}