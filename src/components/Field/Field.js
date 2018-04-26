import React from 'react';
import PropTypes from 'prop-types';
import {clone} from 'ramda';

import './Field.css';
import FieldPosition from '../FieldPosition/FieldPosition';

class Field extends React.Component {
  constructor(props) {
    super(props);

    const {n} = props;
    this.state = {
      positions: Array(n).fill(null).map(() =>
        Array(n).fill(null).map(() => ({
          filled: Math.round(Math.random()) === 1,
          missed: false,
          injured: false
        }))
      )
    };
  }

  handleClick(i, j) {
    this.setState(({positions}) => {
      const isMissed = !positions[i][j].filled;
      const isInjured = !isMissed;
      const newState = clone({positions});

      if (isInjured) {
        newState.positions[i][j] = {
          ...newState.positions[i][j],
          injured: true
        };
      } else {
        newState.positions[i][j] = {
          ...newState.positions[i][j],
          missed: true
        };
      }

      return newState;
    });
  }

  render() {
    return (
      <div className="Field">
        {this.state.positions.map((row, i) => (
          <div
            className="row"
            key={i}
          >
            {row.map((position, j) => (
              <FieldPosition
                key={`${i}-${j}`}
                {...position}
                handleClick={() => this.handleClick(i, j)}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
}

Field.propTypes = {
  n: PropTypes.number.isRequired
};

export default Field;
