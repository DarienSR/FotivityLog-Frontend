import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap'; // https://www.npmjs.com/package/react-calendar-heatmap
import 'react-calendar-heatmap/dist/styles.css';
import { GroupSameDayDifferences } from '../SessionProcessing';
const today = new Date();

export default function Heatmap(props) {
  if(props.sessions === undefined) return null;
  if(props.sessions.length <= 0) return <p style={styles.noDataError}>No Data Available</p> 
  return (
    <>
      <h1>History of Session (minutes)</h1>
      <CalendarHeatmap
        startDate={shiftDate(today, -200)}
        endDate={shiftDate(today, -1)}
        values={GroupSameDayDifferences(props.sessions)}
        classForValue={value => {
          if (!value) {
            return 'color-empty';
          }
          if(value.difference <= 60) return 'color-scale-1'
          if(value.difference <= 120) return 'color-scale-2'
          if(value.difference <= 180) return 'color-scale-3'
          if(value.difference <= 240) return 'color-scale-4'
          if(value.difference <= 300) return 'color-scale-5'
          if(value.difference > 300) return 'color-scale-6'
        }}

        viewBox={"0 0 348 101"}

        titleForValue = {(value) => {
            if(value === null) return null;
            return `${ value.date } - ${ value.difference }`
          }
        }

        showWeekdayLabels={true}
        onClick={(value) => {
          if(value.difference < 60) 
            alert(`Clicked on value with difference: ${value.difference } minutes`)
          else
            alert(`Clicked on value with difference: ${(value.difference / 60).toFixed(2) } hours`)
        }}
      />

      <div style={{display: 'flex', border: '3px solid black', justifyContent:'center', width: '50%', margin: '0 auto'}}>
        <div style={{width: '16rem', backgroundColor: '#f894f0', fontSize: '2rem', color: 'white', textAlign: 'center', fontWeight: 'bold'}}>{"< 1h"}</div>
        <div style={{width: '16rem', backgroundColor: '#b34fab', fontSize: '2rem', color: 'white', textAlign: 'center', fontWeight: 'bold'}}>{"1h - 2h"}</div>
        <div style={{width: '16rem', backgroundColor: '#8f2586', fontSize: '2rem', color: 'white', textAlign: 'center', fontWeight: 'bold'}}>{"2h - 3h"}</div>
      </div>

      <div style={{display: 'flex', border: '3px solid black', justifyContent:'center', width: '50%', margin: '1rem auto'}}>
        <div style={{width: '16rem', backgroundColor: '#8c47cc', fontSize: '2rem', color: 'white', textAlign: 'center', fontWeight: 'bold'}}>{"3h - 4h"}</div>
        <div style={{width: '16rem', backgroundColor: '#552586', fontSize: '2rem', color: 'white', textAlign: 'center', fontWeight: 'bold'}}>{"4h - 5h"}</div>
        <div style={{width: '16rem', backgroundColor: '#1a0b29', fontSize: '2rem', color: 'white', textAlign: 'center', fontWeight: 'bold'}}>{"5h+"}</div>
      </div>
    </>
  );
}

function shiftDate(date, numDays) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
}

let styles = {
  noDataError: {
    alignSelf: 'center',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height:'100%',
    margin: 0
  },
}