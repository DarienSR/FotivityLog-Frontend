import { useMemo, useState, useEffect } from "react"
import { Col, ColorPicker, Row, Space } from 'antd';
export default function SetTags(props) {
  let [arr, setArr] = useState(props.values || [])
  let [name, setName] = useState()
  let [color, setColor] = useState()
  
  let items;

  function AddElement(tag) {
    setArr([...arr, tag])
    setName("")
    setColor("")
    props.Update([...arr, tag])
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

  const [tagColor, setTagColor] = useState('#1677ff')
  const [formatHex, setFormatHex] = useState('hex');
  const hexString = useMemo(
    () => (typeof tagColor === 'string' ? tagColor : tagColor.toHexString()),
    [tagColor],
  );

  return <>
    <label>Tag Name</label>
    <div style={styles.container}>
      <input
        style={styles.input}
        type="text"
        value={name}
        onChange={(e) => { setName(e.target.value) }}
      />

      <label>Tag Color</label>
      <ColorPicker
        format={formatHex}
        value={color}
        onChange={setTagColor}
        onFormatChange={setFormatHex}
      />

      <p style={styles.button} onClick={() => { AddElement({ name, color: hexString }) }}>Add</p>
    </div>
    
    <span style={styles.itemContainer}>
    {
      arr.map((item, index) => {
        return <p style={styles.item}>{ item.name } -  <ColorPicker
        value={item.color}
      /> <span onClick={() => { RemoveElement(index) }} style={styles.delete}>X</span></p>
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