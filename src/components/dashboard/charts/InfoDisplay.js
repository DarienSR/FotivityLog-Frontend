export default function InfoDisplay(props) {
  if(props.sessions.length === 0) return;
  if(props.sessions.topics.length <= 0) return <p style={styles.noDataError}>No Data Available</p> 
  return(
    <div>
      <h2>Session Statistics</h2>
      <div style={styles.container}>
        <p style={styles.title}>Total Hours: <span style={styles.value}>{(props.sessions.totalMinutes / 60).toFixed(2)}</span></p>  
      </div>
      <div style={styles.container}>
        <p style={{...styles.title, ...styles.underline}}>Breakdown by Topic</p>
        {
          Object.entries(props.sessions.topicByMinutes).map(([key, value]) => {
            return <div key={key} style={styles.object}>
              <p style={styles.key}>{key}</p>
              <p style={styles.value}>{(value / 60).toFixed(2)} hours</p>
            </div>
          })
        }
      </div>

      <div style={styles.container}>
        <p style={{...styles.title, ...styles.underline}}>Breakdown by Location</p>
        {
          Object.entries(props.sessions.locationByMinutes).map(([key, value]) => {
            return <div key={key} style={styles.object}>
              <p style={styles.key}>{key}</p>
              <p style={styles.value}>{(value / 60).toFixed(2)} hours</p>
            </div>
          })
        }
      </div>
    </div>
  )
}


let styles = {
  groupContainers: {
    display: 'flex',
  },
  noDataError: {
    alignSelf: 'center',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height:'100%',
    margin: 0
  },
  container: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    jusifyContent: 'flex-start',
    margin: '0.6rem'
  },
  object: {
    width: '30%',
    padding: '0.25rem',
  },
  title: {
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '1.3rem',
    width: '100%',
    margin: 0,
  },
  underline: {
    borderBottom: '2px solid black',
    marginBottom: '1rem'
  },
  key: {
    textAlign: 'left',
    fontWeight: 'bold',
    margin: 0,
    marginBottom: '0.25rem',
  },
  value: {
    fontWeight: 'normal',
    fontSize: '1.1rem',
    textAlign: 'left',
    margin: 0,
    marginBottom: '0.25rem',
    paddingLeft: '0.5rem'
  },
}