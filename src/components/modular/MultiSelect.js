import { Radio, Select, Space } from 'antd';
import { useState } from 'react';



export default function MutliSelect(props) {
  const [size, setSize] = useState('middle');

  console.log("multi", props)

  const handleChange = (value) => {

    

    props.Update(value)
  };
  return (
    <>

        <label>{props.label}</label>
        <Select
          mode="multiple"
          size={size}
          placeholder="Please select"
          onChange={handleChange}
          style={{
            width: '100%',
          }}
          options={props.values}
        />


    </>
  );
};
