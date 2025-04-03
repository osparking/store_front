import React from 'react'
import { InputGroup } from 'react-bootstrap';
import { Form } from 'react-router-dom';

const ItemFilter = ({
  itemType,
  selectedType,
  onTypeSelection,
}) => {
  return (
    <InputGroup className='mb-2'>
      <InputGroup.Text>{itemType} 검색</InputGroup.Text>
      <Form.Select
        className="form-control"
        value={selectedType}
        onChange={(e) => onTypeSelection(e.target.value)}
      ></Form.Select>
    </InputGroup>
  );
}

export default ItemFilter