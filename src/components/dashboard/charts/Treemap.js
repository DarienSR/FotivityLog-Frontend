import { React } from "react";
import Chart from "react-apexcharts";

export default function Treemap(props) {
  if(props.data === undefined) return null;
  if(props.data.length <= 0) return <p style={styles.noDataError}>No Data Available</p> 

  function mapWordCounts(words) {
    const counts = new Map();
    for (const word of words) { counts.set(word, (counts.get(word) ?? 0) + 1) }
    return counts;
  }

  let values = []
  mapWordCounts(props.data).forEach((val, key) => {
    values.push({x: key, y: val})
  })

  let data = {
    series: [
      {
        data: values
      }
    ],
    options: {
      legend: {
        show: false
      },
      chart: {
        height: 350,
        type: 'treemap'
      },
      title: {
        text: props.title,
      },
      dataLabels: {
        style: {
          colors: ['#5e5c56']
        }
      },
      plotOptions: {
        treemap: {
          colorScale: {
            ranges: [
              {
                from: 0,
                to: 15,
                color: '#67ff49'
              },
              {
                from: 15,
                to: 30,
                color: '#28c45c'
              },
              {
                from: 30,
                to: 60,
                color: '#0d6836'
              },
              {
                from: 60,
                to: 100,
                color: '#49b6ff'
              },
              {
                from: 100,
                to: 200,
                color: '#286cc4'
              },
              {
                from: 200,
                to: Infinity,
                color: '#104a81'
              }
            ]
          }
        }
      }
    },
  };
  return <Chart options={ data.options } series={ data.series } type="treemap" height={ 550 } />
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


    
