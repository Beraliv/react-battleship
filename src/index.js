import React from 'react';
import ReactDOM from 'react-dom';

import registerServiceWorker from './registerServiceWorker';
import './index.css';
import Field from './components/Field/Field';

const FIELD_SIZE = 10;
const SHIP_TYPES = [[4, 1], [3, 2], [2, 3], [1, 4]];

ReactDOM.render(
  <Field size={FIELD_SIZE} shipTypes={SHIP_TYPES} />,
  document.getElementById('root')
);
registerServiceWorker();
