import {xprod, clone} from 'ramda';

import * as helpers from './';

const fieldGenerator = (n, filled) => Array(n).fill(null).map(() =>
  Array(n).fill(null).map(() => ({
    filled,
    missed: false,
    injured: false,
    killed: false
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