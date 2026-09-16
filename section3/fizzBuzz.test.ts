
// ルール： 数値を受け取る
// 3の倍数なら'Fizz'
// 5の倍数なら'Buzz'
// 両方の倍数なら'FizzBuzz'
// それ以外は数値を文字列にして返す

import { fizzBuzz } from './fizzBuzz';

test('3の倍数ならFizzを返す', () => {
  expect(fizzBuzz(3)).toBe('Fizz');
});

test('5の倍数ならBuzzを返す', () => {
  expect(fizzBuzz(5)).toBe('Buzz');
});
test('3と5の倍数ならFizzBuzzを返す', () => {
  expect(fizzBuzz(15)).toBe('FizzBuzz');
});
test('それ以外の数なら数値を文字列にして返す', () => {
  expect(fizzBuzz(7)).toBe('7');
});
