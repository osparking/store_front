import React from 'react'
import { InputGroup } from 'react-bootstrap';
import { Form } from 'react-router-dom';

const ItemFilter = ({
  itemType,
  options = [],
  onClearFilter,
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
      >
        <option value="">- {itemType} 선택 -</option>
        {options.map((option, idx) => (
          <option value={option} key={idx}>
            {option}
          </option>
        ))}
      </Form.Select>
      <Button variant="secondary" onClick={onClearFilter}>
        초기화
      </Button>        
    </InputGroup>
  );
}

export default ItemFilter