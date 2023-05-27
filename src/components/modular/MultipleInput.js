import { useState, useEffect } from "react"
export default function MultipleInput(props) {
  let [arr, setArr] = useState([])
  let [value, setValue] = useState()
  
  let items;

  function AddElement() {
    setArr([...arr, value])
    setValue("")
    props.Update([...arr, value])
  }

  function RemoveElement(index) {
    if(arr.length === 1) setArr([])
    else setArr([
      ...arr.slice(0, index),
      ...arr.slice(index + 1, arr.length)
    ])

    props.Update([
      ...arr.slice(0, index),
      ...arr.slice(index + 1, arr.length)
    ])
  }

  return <>
    <label>{props.label}</label>
    <div style={styles.container}>
      <input
        style={styles.input}
        type="text"
        value={value}
        onChange={(e) => { setValue(e.target.value) }}
      />
      <p style={styles.button} onClick={() => { AddElement() }}>Add</p>
    </div>
    
    <span style={styles.itemContainer}>
    {
      arr.map((item, index) => {
        return <p style={styles.item}>{ item } <span onClick={() => { RemoveElement(index) }} style={styles.delete}>X</span></p>
        })
      }
    </span>
  </>
}

let styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    marginTop: '1.2rem'
  },
  button: {
    width: '5%',
    border: '2px solid black',
    marginLeft: '1rem 1rem',
    padding: '0.3rem',
    alignSelf: 'center',
  },
  itemContainer: {
    display: 'flex',
    overflowY: 'scroll',
    flexWrap: 'wrap',
    maxHeight: '10rem'
  },
  item: {
    paddingLeft: '1rem',
    width: '90%'
  },
  delete: {
    marginLeft: '1rem',
    width: '10%',
    color: 'red'
  }
}