import React from 'react';
import PropTypes from 'prop-types';
import {clone} from 'ramda';

import './Field.css';
import FieldPosition from '../FieldPosition/FieldPosition';
import {generateBattleField} from '../../helpers';

class Field extends React.Component {
  constructor(props) {
    super(props);

    const {size, shipTypes} = props;
    const [positions, ships] = generateBattleField(size, shipTypes);
    this.state = {
      positions,
      ships,
      totals: {
        missed: 0,
        injured: 0,
        killed: 0
      }
    };
  }

  handleClick(i, j) {
    this.setState(({positions, ships, totals}) => {
      const ship = ships.find(s => s.findIndex(([x, y]) => x === i && y === j) !== -1);
      const isMissed = ship === null || ship === undefined;
      const isKilled = !isMissed && ship.every(([x, y]) => positions[x][y].injured || (x === i && y === j));
      const isInjured = !isMissed && !isKilled;
      const newState = clone({positions, ships, totals});

      if (isKilled) {
        ship.forEach(([x, y]) => {
          newState.positions[x][y] = {
            ...newState.positions[x][y],
            injured: false,
            killed: true
          };
        });
        newState.totals.injured -= ship.length - 1;
        newState.totals.killed += ship.length;
      } else if (isInjured) {
        newState.positions[i][j] = {
          ...newState.positions[i][j],
          injured: true
        };
        newState.totals.injured++;
      } else {
        newState.positions[i][j] = {
          ...newState.positions[i][j],
          missed: true
        };
        newState.totals.missed++;
      }

      return newState;
    });
  }

  reloadPage() {
    window.location.reload();
  }

  render() {
    const {totals: {killed, missed}} = this.state;
    const isFinished = killed === 20;

    const field = this.state.positions.map((row, i) => (
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
    ));

    const win = (
      <div className="win">
        <div className="missed">
          Missed: {missed}
        </div>
        <div className="killed">
          Killed: 20
        </div>
        <div className="rest">
          Rest: {80 - missed}
        </div>
        <input type="button" value="Play again" onClick={() => this.reloadPage()} />
      </div>
    );

    return (
      <div className="Field">
        {isFinished
          ? win
          : field
        }
      </div>
    );
  }
}

Field.propTypes = {
  size: PropTypes.number.isRequired,
  shipTypes: PropTypes.array.isRequired
};

export default Field;
