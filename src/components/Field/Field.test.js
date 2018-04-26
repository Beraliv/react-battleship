import React from 'react';
import ReactDOM from 'react-dom';
import Field from './Field';

it('renders without crashing if all required parameters are passed', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Field size={10} shipTypes={[]} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
