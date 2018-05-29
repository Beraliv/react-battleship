import React from 'react';
import ReactDOM from 'react-dom';
import Field from './Field';

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: key => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: key => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

it('renders without crashing if all required parameters are passed', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Field size={10} shipTypes={[]} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
