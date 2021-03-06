import React from 'react';
import ReactDOM from 'react-dom';
import FieldPosition from './FieldPosition';

it('renders without crashing if have all required fields', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <FieldPosition
      miss={false}
      hit={false}
      sank={false}
      handleClick={e => alert(e.target.value)}
    />,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
