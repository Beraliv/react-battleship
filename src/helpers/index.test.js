import {xprod, clone} from 'ramda';

import * as helpers from './';

const fieldGenerator = (n, filled) => Array(n).fill(null).map(() =>
  Array(n).fill(null).map(() => ({
    filled,
    miss: false,
    hit: false,
    sank: false
  }))
);

const N = 10;
const FILLED_FIELD = fieldGenerator(N, true);
const EMPTY_FIELD = fieldGenerator(N, false);

const RANGE_1_TO_N = Array(N).fill(0).map((_, i) => i);
const FREE_POSITIONS = xprod(RANGE_1_TO_N, RANGE_1_TO_N);

test('isPointWithinRange', () => {
  const {isPointWithinRange} = helpers;

  expect(isPointWithinRange(-1, N)).toBeFalsy();
  expect(isPointWithinRange(0, N)).toBeTruthy();
  expect(isPointWithinRange(N - 1, N)).toBeTruthy();
  expect(isPointWithinRange(N, N)).toBeFalsy();
});

test('isPointWithinField', () => {
  const {isPointWithinField} = helpers;

  expect(isPointWithinField(-1, 0, N)).toBeFalsy();
  expect(isPointWithinField(0, -1, N)).toBeFalsy();
  expect(isPointWithinField(0, 0, N)).toBeTruthy();
  expect(isPointWithinField(0, N - 1, N)).toBeTruthy();
  expect(isPointWithinField(N - 1, 0, N)).toBeTruthy();
  expect(isPointWithinField(N - 1, N - 1, N)).toBeTruthy();
  expect(isPointWithinField(N, N, N)).toBeFalsy();
});

test('isFree', () => {
  const {isFree} = helpers;

  expect(isFree(EMPTY_FIELD, 0, 0)).toBeTruthy();
  expect(isFree(EMPTY_FIELD, 0, -1)).toBeTruthy();
  expect(isFree(EMPTY_FIELD, -1, 0)).toBeTruthy();
  expect(isFree(EMPTY_FIELD, -1, -1)).toBeTruthy();
  expect(isFree(EMPTY_FIELD, N - 1, N - 1)).toBeTruthy();
  expect(isFree(EMPTY_FIELD, N, N)).toBeTruthy();
  expect(isFree(FILLED_FIELD, 0, 0)).toBeFalsy();
  expect(isFree(FILLED_FIELD, 0, -1)).toBeTruthy();
  expect(isFree(FILLED_FIELD, -1, 0)).toBeTruthy();
  expect(isFree(FILLED_FIELD, -1, -1)).toBeTruthy();
  expect(isFree(FILLED_FIELD, N - 1, N - 1)).toBeFalsy();
  expect(isFree(FILLED_FIELD, N, N)).toBeTruthy();
});

test('isValid', () => {
  const {isValid} = helpers;

  expect(isValid(EMPTY_FIELD, 0, 0)).toBeTruthy();
  expect(isValid(EMPTY_FIELD, 0, -1)).toBeFalsy();
  expect(isValid(EMPTY_FIELD, -1, 0)).toBeFalsy();
  expect(isValid(EMPTY_FIELD, -1, -1)).toBeFalsy();
  expect(isValid(EMPTY_FIELD, N / 2, N / 2)).toBeTruthy();
  expect(isValid(EMPTY_FIELD, 0, N - 1)).toBeTruthy();
  expect(isValid(EMPTY_FIELD, N - 1, 0)).toBeTruthy();
  expect(isValid(EMPTY_FIELD, N - 1, N - 1)).toBeTruthy();
  expect(isValid(EMPTY_FIELD, N - 1, N)).toBeFalsy();
  expect(isValid(EMPTY_FIELD, N, N - 1)).toBeFalsy();
  expect(isValid(EMPTY_FIELD, N, N)).toBeFalsy();
});

test('getFieldPositionsAround', () => {
  const {getFieldPositionsAround} = helpers;

  const LENGTH_OF_SHIP = ship => ship.length * 2 + 6;

  const SHIPS = [
    [[N / 2, N / 2]],
    [[N / 2, N / 2], [N / 2, N / 2 + 1]],
    [[N / 2, N / 2 - 1], [N / 2, N / 2], [N / 2, N / 2 + 1]],
    [[N / 2, N / 2 - 1], [N / 2, N / 2], [N / 2, N / 2 + 1]]
  ];

  SHIPS.forEach(ship => {
    expect(getFieldPositionsAround(ship).length).toBe(LENGTH_OF_SHIP(ship));
  });
});

test('getFieldPositionsAround + isPointWithinField', () => {
  const {getFieldPositionsAround, isPointWithinField} = helpers;

  const UPPER_SHIP = [[0, N / 2], [1, N / 2]];
  const LEFT_SHIP = [[N / 2, 0], [N / 2 + 1, 0]];
  const CENTER_SHIP = [[N / 2, N / 2], [N / 2 + 1, N / 2]];
  const RIGHT_SHIP = [[N / 2, N - 1], [N / 2 + 1, N - 1]];
  const BOTTOM_SHIP = [[N - 2, N / 2], [N - 1, N / 2]];

  const [UPPER_AROUND, LEFT_AROUND, CENTER_AROUND, RIGHT_AROUND, BOTTOM_AROUND] =
    [UPPER_SHIP, LEFT_SHIP, CENTER_SHIP, RIGHT_SHIP, BOTTOM_SHIP]
      .map(ship => getFieldPositionsAround(ship).filter(([x, y]) => isPointWithinField(x, y, N)));

  expect(UPPER_AROUND.length).toEqual(2 * UPPER_SHIP.length + 3);
  expect(LEFT_AROUND.length).toEqual(LEFT_SHIP.length + 4);
  expect(CENTER_AROUND.length).toEqual(2 * CENTER_SHIP.length + 6);
  expect(RIGHT_AROUND.length).toEqual(RIGHT_SHIP.length + 4);
  expect(BOTTOM_AROUND.length).toEqual(2 * BOTTOM_SHIP.length + 3);
});

test('buildShip', () => {
  const {buildShip, LEFT, UP, RIGHT, DOWN} = helpers;

  expect(buildShip(0, 0, DOWN, 4)).toEqual([[0, 0], [0, 1], [0, 2], [0, 3]]);
  expect(buildShip(N - 1, 0, LEFT, 3)).toEqual([[N - 1, 0], [N - 2, 0], [N - 3, 0]]);
  expect(buildShip(N - 1, N - 1, UP, 2)).toEqual([[N - 1, N - 1], [N - 1, N - 2]]);
  expect(buildShip(0, N - 1, RIGHT, 1)).toEqual([[0, N - 1]]);
});

test('shipGenerator', () => {
  const {shipGenerator, isValid} = helpers;
  const freePositions = clone(FREE_POSITIONS);
  const field = clone(EMPTY_FIELD);

  const battleship = shipGenerator(field, freePositions, 4);
  expect(battleship.every(([x, y]) => isValid(field, x, y))).toBeTruthy();

  const cruiser = shipGenerator(field, freePositions, 3);
  expect(cruiser.every(([x, y]) => isValid(field, x, y))).toBeTruthy();

  const submarine = shipGenerator(field, freePositions, 2);
  expect(submarine.every(([x, y]) => isValid(field, x, y))).toBeTruthy();

  const destroyer = shipGenerator(field, freePositions, 1);
  expect(destroyer.every(([x, y]) => isValid(field, x, y))).toBeTruthy();
});

test('generateBattleField', () => {
  const {generateBattleField} = helpers;

  const checkGeneratedFieldAndShips = (size, times) => {
    const [field, ships] = generateBattleField(N, [[size, times]]);
    expect(field.reduce((acc, row) => acc + row.reduce((filledTimes, {filled}) => filledTimes + (filled ? 1 : 0), 0), 0)).toBe(size * times);
    expect(ships.length).toBe(times);
    expect(ships.every(ship => ship.length === size)).toBeTruthy();
  };

  checkGeneratedFieldAndShips(1, 4);
  checkGeneratedFieldAndShips(2, 3);
  checkGeneratedFieldAndShips(3, 2);
  checkGeneratedFieldAndShips(4, 1);
});
