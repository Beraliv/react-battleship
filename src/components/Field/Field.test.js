import React from 'react';
import ReactDOM from 'react-dom';
import Field from './Field';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Field n={10} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
