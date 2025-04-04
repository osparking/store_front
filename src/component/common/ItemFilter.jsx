import React from 'react'
import { Button, InputGroup, Form } from 'react-bootstrap';

const ItemFilter = ({
  itemType,
  options = [],
  onClearFilter,
  onOptionSelection,
  selectedOption,
}) => {
  return (
    <InputGroup className='mb-2'>
      <InputGroup.Text>{itemType} 검색</InputGroup.Text>
      <Form.Select
        className="form-control"
        value={selectedOption}
        onChange={(e) => onOptionSelection(e.target.value)}
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