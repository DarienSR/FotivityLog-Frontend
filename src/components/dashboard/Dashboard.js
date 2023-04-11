import "../../App.css"
import useAuth from '../../hooks/useAuth.js'
import React, { useState, useEffect } from 'react';
import { useGetSessionsQuery } from "../sessions/sessionsApiSlice"
import axios from "axios";
import Heatmap from "./charts/Heatmap";
import Treemap from './charts/Treemap';
import 'react-calendar-heatmap/dist/styles.css';
import { useNavigate, useLocation } from "react-router-dom";

import "./SessionProcessing"; // imports all functions from file
import { ProcessSessionData } from './SessionProcessing';
import InfoDisplay from './charts/InfoDisplay';

const Dashboard = () => {
  const { username, email, id} = useAuth()

  const {
    data: sessions,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetSessionsQuery(id, {
    // pollingInterval: 60000, // refresh data every minute
    refetchedOnFocus: true, // refresh data when window is focused again
    refetchOnMountOrArgChange: true
  })


  
  const { state } = useLocation();
  let navigate = useNavigate();
  let [data, setData] = useState([]);
  let [alert, setAlert] = useState("");
  let [alertIsVisible, setAlertIsVisible] = useState(false);
  let [alertError, setAlertError] = useState(false)

  let content;


  if(isSuccess) {
   let sessionData = ProcessSessionData(sessions);
    
    content = <div className="fotivity-container">
    <div style={ styles.dashboardContainer }>
      <div style={{ ...styles.component, ...styles.large}}>
        <Heatmap sessions={ sessionData.times }  /> 
      </div>
      <div style={{ ...styles.component, ...styles.medium}}>
        <InfoDisplay sessions={ sessionData }  />
      </div>
    </div>

    <div style={ styles.dashboardContainer }>
      <div style={ { ...styles.component, ...styles.medium } }>
        <Treemap data={ sessionData.locations } title="Locations" />
      </div>
      <div style={{ ...styles.component, ...styles.large }}>
        <Treemap data={ sessionData.topics } title="Topics" />
      </div>
    </div>
  </div>
  }

  return (
    <div>
      {content}
    </div>
  )
}


var list;
list = document.getElementsByClassName("react-calendar-heatmap");
for (let index = 0; index < list.length; ++index) {
    list[index].setAttribute("viewBox", "0 0 348 100");
}

let styles = {
  dashboardContainer: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'row',
  },
  component: {
    padding: '1rem',
    backgroundColor: '#fff4f469',
    margin: '0.25rem',
    width: '40%',
    borderRadius: '0.5%',
    border: '2px solid #dcd4d4',
    boxShadow: '2px 2px 3px 2px #dcd4d4'
  },
  small: {
    width: '25%',
  },
  medium: {
    width: '50%',
  },
  large: {
    width: '80%',
  }
}

export default Dashboard