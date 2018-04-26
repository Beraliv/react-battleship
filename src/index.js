import React from 'react';
import ReactDOM from 'react-dom';

import registerServiceWorker from './registerServiceWorker';
import './index.css';
import Field from './components/Field/Field';

ReactDOM.render(<Field n={10} />, document.getElementById('root'));
registerServiceWorker();
