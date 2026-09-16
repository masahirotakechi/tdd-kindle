import { subtract } from './subtract';
import { expect, test } from '@jest/globals';

test('100-50は50になる', () => {
  expect(subtract(100, 50)).toBe(50);
})