import { sum } from './sum';
import { expect, test } from '@jest/globals';
test('1+2は3になる', () => {
  expect(sum(1, 2)).toBe(3);
})