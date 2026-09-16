// 閏年（うるうどし）判定: 以
// 下のルールを持つ関数をTDDで作ってみましょう
// 4で割り切れる年は閏年
// ただし、100で割り切れる年は平年
// ただし、400で割り切れる年は閏年

import { describe } from '@jest/globals';
import { uruudoshi } from './uruudoshi';


describe('閏年判定', () => {
  test('4で割り切れたら閏年を返す', () => {
    expect(uruudoshi(2000)).toBe('閏年');
  });
  test('4で割り切れなかったら平年を返す', () => {
    expect(uruudoshi(2001)).toBe('平年');
  });
  test('100で割り切れたら平年を返す', () => {
    expect(uruudoshi(1900)).toBe('平年');
  });
  test('400で割り切れたら閏年を返す', () => {
    expect(uruudoshi(2000)).toBe('閏年');
  });
});
