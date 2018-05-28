import React from 'react';
import PropTypes from 'prop-types';
import {clone} from 'ramda';

import './Field.css';
import FieldPosition from '../FieldPosition/FieldPosition';
import {
  generateBattleField,
  getFieldPositionsAround,
  isPointWithinField
} from '../../helpers';

const INITIAL_STATE = props => {
  const {size, shipTypes} = props;
  const [positions, ships] = generateBattleField(size, shipTypes);
  return {
    positions,
    ships,
    totals: {
      miss: 0,
      hit: 0,
      sank: 0
    }
  };
};

class Field extends React.Component {
  state = {
    ...INITIAL_STATE(this.props)
  }

  handleClick(i, j) {
    this.setState(({positions, ships, totals}) => {
      const ship = ships.find(s => s.findIndex(([x, y]) => x === i && y === j) !== -1);
      const isMiss = ship === null || ship === undefined;
      const isSank = !isMiss && ship.every(([x, y]) => positions[x][y].hit || (x === i && y === j));
      const isHit = !isMiss && !isSank;
      const newState = clone({positions, ships, totals});

      if (isSank) {
        ship.forEach(([x, y]) => {
          newState.positions[x][y] = {
            ...newState.positions[x][y],
            hit: false,
            sank: true
          };
        });
        getFieldPositionsAround(ship)
          .filter(([x, y]) => isPointWithinField(x, y, this.props.size))
          .forEach(([x, y]) => {
            newState.positions[x][y] = {
              ...newState.positions[x][y],
              miss: true
            };
          });
        newState.totals.hit -= ship.length - 1;
        newState.totals.sank += ship.length;
      } else if (isHit) {
        newState.positions[i][j] = {
          ...newState.positions[i][j],
          hit: true
        };
        newState.totals.hit++;
      } else /* if (isMiss) */ {
        newState.positions[i][j] = {
          ...newState.positions[i][j],
          miss: true
        };
        newState.totals.miss++;
      }

      return newState;
    });
  }

  reloadPage() {
    this.setState({
      ...INITIAL_STATE(this.props)
    });
  }

  render() {
    const {totals: {sank, miss}} = this.state;
    const isFinished = sank === 20;

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
        <div className="miss">
          Misses: {miss}
        </div>
        <div className="sunk">
          Sunk: 20
        </div>
        <div className="rest">
          Rest: {80 - miss}
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
