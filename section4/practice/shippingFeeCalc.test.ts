// 送料を計算する関数のテスト
// 1000円以上なら無料（送料0円）
// それ未満は送料がかかる（送料500円）

import { shippingFeeCalc } from './shippingFeeCalc';

describe('送料計算', () => {
  // 正常系
  test('2000円は送料がかからない', () => {
    expect(shippingFeeCalc(2000)).toBe(0);
  });
  test('500円は送料がかかる', () => {
    expect(shippingFeeCalc(500)).toBe(500);
  });

  // 異常系
  test('0円は送料がエラーとなる', () => {
    expect(() => shippingFeeCalc(0)).toThrow('価格は0より大きい必要があります');
  });

  // 境界値系
  test('1000円は送料がかからない', () => {
    expect(shippingFeeCalc(1000)).toBe(0);
  });
  test('999円は送料がかかる', () => {
    expect(shippingFeeCalc(999)).toBe(500);
  });
});
