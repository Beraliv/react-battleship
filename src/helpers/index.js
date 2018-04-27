import {xprod, clone, without, unnest} from 'ramda';

export const LEFT = 0;
export const UP = 1;
export const RIGHT = 2;
export const DOWN = 3;

const ALL_DIRECTIONS = [LEFT, UP, RIGHT, DOWN];

export const isPointWithinRange = (x, n) => {
  return 0 <= x && x < n;
};

export const isPointWithinField = (x, y, n) => {
  return isPointWithinRange(x, n)
    && isPointWithinRange(y, n);
};

export const isFree = (field, x, y) => {
  try {
    return !field[x][y].filled;
  } catch (_) {
    // it's out of bounds
    return true;
  }
};

export const isValid = (field, x, y) => {
  const n = field.length;
  const close = xprod([x - 1, x, x + 1], [y - 1, y, y + 1]);
  const around = without([x, y], close);

  return isPointWithinField(x, y, n)
    && around.every(([x, y]) => isFree(field, x, y));
};

export const buildShip = (x, y, direction, size) => {
  const nextPosition = (direction) => {
    let indent;
    if (direction === LEFT) {
      indent = [-1, 0];
    } else if (direction === RIGHT) {
      indent = [1, 0];
    } else if (direction === UP) {
      indent = [0, -1];
    } else /* if (direction === DOWN) */ {
      indent = [0, 1];
    }
    return (x, y, i) => [x + indent[0] * i, y + indent[1] * i];
  };
  const next = nextPosition(direction);

  return Array(size)
    .fill(0)
    .map((_, i) => next(x, y, i));
};

export const shipGenerator = (field, freePositions, size) => {
  const directions = ALL_DIRECTIONS;
  while (directions.length > 0) {
    // direction
    const directionIndex = Math.round(Math.random() * (directions.length - 1));
    const direction = directions[directionIndex];
    // position
    const fieldClone = clone(field);
    const freePositionsClone = clone(freePositions);
    while (freePositionsClone.length > 0) {
      const positionIndex = Math.round(Math.random() * (freePositionsClone.length - 1));
      let [x, y] = freePositionsClone[positionIndex];
      const ship = buildShip(x, y, direction, size);
      if (ship.every(([x, y]) => isValid(fieldClone, x, y))) {
        return ship;
      }
      freePositionsClone.splice(positionIndex, positionIndex);
    }
  }
};

export const generateBattleField = (n, shipTypes) => {
  const field = Array(n).fill(null).map(() =>
    Array(n).fill(null).map(() => ({
      filled: false,
      miss: false,
      hit: false,
      sank: false
    }))
  );
  const iter = Array(n).fill(0).map((_, i) => i);
  let freePositions = xprod(iter, iter);

  const allShips = unnest(
    shipTypes.map(([size, times]) => {
      let ships = [];
      for (let i = 0; i < times; i++) {
        const ship = shipGenerator(field, freePositions, size, times);
        ship.forEach(([x, y]) => {
          field[x][y].filled = true;
        });
        freePositions = without(ship, freePositions);
        ships.push(ship);
      }
      return ships;
    })
  );

  return [field, allShips];
};