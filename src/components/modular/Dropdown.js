import { useState, useEffect } from "react"
import { Select } from 'antd';
export default function Dropdown(props) {
  const [value, setValue] = useState(props.options[0])
  const [index, setIndex] = useState(null)

  const handleChange = (e) => {
    // return the index of the dropdown selection
    props.onChange(props.options.indexOf(e))
  };

  let options = []
  
  props.options.map((option, index) => {
    options.push({value: option, label: option, index: index})
    return null
  })
  
  useEffect(() => {
    setValue(props.options[0])
  }, [props.options[0]])

  return <>
    <label>{props.label}</label>
    <Select
    defaultValue={ props.options[0] }
    style={{ width: 200 }}
    onChange={(e) => handleChange(e)}
    options={options}
  />
  </>
  
}