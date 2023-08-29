import { useNavigate } from 'react-router-dom';
import "../../App.css"
import Card from './Card';
export default function Header(props) {
  const navigate = useNavigate();

  function HandleAction() {
    props.action();
  }

  function HandleBackAction() {
    props.backAction()
  }

  return (
    <div style={ styles.header }>
      <div style={ styles.navigation }>
        <div>
          <h2 style={ styles.title } >{ props.title }</h2>
          <button style={ styles.back } onClick={ () => HandleBackAction() }>{ props.backText || "Back" }</button>
        </div>

        {
          props.action ? 
          <div style={styles.actionContainer}>
            <button style={ styles.action } onClick={() => HandleAction() }>{ props.actionText }</button>
          </div> : null
        }
      </div>

      <div style={ styles.dashboard }>
        { props.cards?.map((card) => {
          return <Card cardBGColor={card.cardBGColor} circleBGColor={card.circleBGColor} x={card.x} y={card.y} text={card.text}  />
        }) }
      </div>

    </div>
  )
}

let styles = {
  header: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '4rem'
  },

  navigation: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  title: {
    fontWeight: 'bold',
    fontSize: '2rem',
    margin: 0
  },

  back: {
    backgroundColor: '#F9F8F8',
    border: 0,
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: '#463A3A',
    padding: 0,
    paddingLeft: '0.25rem',
    cursor: 'pointer'
  },

  actionContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column'
  },

  action: {
    borderRadius: '10px',
    border: '2px solid #FFFFFF',
    color: '#463A3A',
    backgroundColor: '#FFFFFF',
    boxShadow: '#00000052 0px 2px 2px',
    padding: '0.5rem',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    alignSelf: 'center',
  },

  dashboard: {
    display: 'flex',
    flexDirection: 'row',
    margin: '0 auto',
    width: '60%',
    justifyContent: 'space-evenly'
  }
}