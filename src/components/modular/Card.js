// x value
// y value
// text 


export default function Card(props) {
  return <div style={{...styles.card, backgroundColor: props.cardBGColor}}>
    <div style={{...styles.circle,  backgroundColor: props.circleBGColor }} id='circle'>
      <p style={ styles.circleText }>{ props.x } / { props.y }</p>
    </div>
    <div style={styles.textContainer} id='text'>
      <p style={styles.text}>{ props.text }</p>
    </div>
  </div>
}

let styles = {
  card: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: '10px',
    width: '18rem',
    height: '8rem',
    margin: '1rem'
  },

  circle: {
    minHeight: '75px',
    minWidth: '75px',
    borderRadius: '50%',
    display: 'flex',
    alignSelf: 'center',
    marginLeft: '1rem'
  },

  circleText: {
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.2rem'
  },

  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: '1rem',
    fontSize: '1.4rem',
    
  },

  text: {
    color: 'white',
  }
}