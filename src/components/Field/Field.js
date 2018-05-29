import React from 'react';
import PropTypes from 'prop-types';
import {clone} from 'ramda';

import './Field.css';
import timeSrc from '../../imgs/time.svg';
import sunkSrc from '../../imgs/drop.svg';
import restSrc from '../../imgs/etc.svg';
import missSrc from '../../imgs/multiply.svg';

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

const LOCAL_STORAGE_ID = 'react-battleship';

class Field extends React.Component {
  state = {
    ...INITIAL_STATE(this.props)
  }

  updateForSank = (state, ship) => {
    ship.forEach(([x, y]) => {
      state.positions[x][y] = {
        ...state.positions[x][y],
        hit: false,
        sank: true
      };
    });
    getFieldPositionsAround(ship)
      .filter(([x, y]) => isPointWithinField(x, y, this.props.size))
      .forEach(([x, y]) => {
        state.positions[x][y] = {
          ...state.positions[x][y],
          miss: true
        };
      });
    state.totals.hit -= ship.length - 1;
    state.totals.sank += ship.length;

    return state;
  }

  updateForHit = (state, i, j) => {
    state.positions[i][j] = {
      ...state.positions[i][j],
      hit: true
    };
    state.totals.hit++;

    return state;
  }

  updateForMiss = (state, i, j) => {
    state.positions[i][j] = {
      ...state.positions[i][j],
      miss: true
    };
    state.totals.miss++;

    return state;
  }

  handleClick = (i, j) => {
    this.setState(({positions, ships, totals}) => {
      const ship = ships.find(s => s.findIndex(([x, y]) => x === i && y === j) !== -1);
      const isMiss = ship === null || ship === undefined;
      const isSank = !isMiss && ship.every(([x, y]) => positions[x][y].hit || (x === i && y === j));
      const isHit = !isMiss && !isSank;
      let newState = clone({positions, ships, totals});

      if (isSank) {
        newState = this.updateForSank(newState, ship);
      } else if (isHit) {
        newState = this.updateForHit(newState, i, j);
      } else /* if (isMiss) */ {
        newState = this.updateForMiss(newState, i, j);
      }

      return newState;
    });
  }

  restart = () => {
    this.setState({
      ...INITIAL_STATE(this.props)
    });
  }

  getResults = () => JSON.parse(global.localStorage.getItem(LOCAL_STORAGE_ID)) || []

  saveResults = (miss) => {
    const results = this.getResults();
    const time = new Date().toString().slice(0, 15);
    results.push({miss, time});
    global.localStorage.setItem(LOCAL_STORAGE_ID, JSON.stringify(results));
  }

  getFiveBest = () => this.getResults()
    .sort((a, b) => a.miss - b.miss)
    .slice(0, 5)

  render() {
    const {totals: {sank, miss}} = this.state;
    const isFinished = sank === 20;
    if (isFinished) {
      this.saveResults(miss);
    }

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

    const fiveBest = this.getFiveBest();
    const statistics = (
      <div className="win">
        <h1>5 best</h1>
        <div className="statistics">
          <div className="time">
            <img src={timeSrc} alt="Time"/>
            {fiveBest.map(({time}, index) => (
              <div key={index}>{time}</div>
            ))}
          </div>
          <div className="miss">
            <img src={missSrc} alt="Misses"/>
            {fiveBest.map(({miss}, index) => (
              <div key={index}>{miss}</div>
            ))}
          </div>
          <div className="sunk">
            <img src={sunkSrc} alt="Sunk"/>
            {fiveBest.map((_, index) => (
              <div key={index}>{20}</div>
            ))}
          </div>
          <div className="rest">
            <img src={restSrc} alt="Rest"/>
            {fiveBest.map(({miss}, index) => (
              <div key={index}>{80 - miss}</div>
            ))}
          </div>
        </div>
        <input type="button" value="Play again" onClick={this.restart} />
      </div>
    );

    return (
      <div className="Field">
        {isFinished
          ? statistics
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
