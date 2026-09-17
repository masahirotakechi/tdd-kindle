// 演習問題1: 特性化テストの実践
//
// 目標: OrderService の「現状の挙動」をそのまま記録するテストを書く。
//       バグが含まれていてもOK。挙動を固定することが目的。
//
// ヒント:
//   - まず実際に関数を呼び出して console.log で結果を確認する
//   - 「こうあるべき」ではなく「今こう動いている」を expect に書く
//   - バグっぽい挙動を見つけたら、コメントで「これはバグでは？」と記録する

import { OrderService, Item } from './orderService';

const service = new OrderService();

// ---------- calculateTotal の特性化テスト ----------

test('特性化: 合計が5000円未満の場合、送料500円が加算される', () => {
  const items: Item[] = [{ name: 'りんご', price: 200, quantity: 3 }];

  // TODO: service.calculateTotal(items) を呼び出し、結果を確認して埋めてください
  const result = service.calculateTotal(items);
  expect(result).toBe(1100);
});

test('特性化: 合計が5000円以上の場合、送料は加算されない', () => {
  const items: Item[] = [{ name: 'テレビ', price: 5000, quantity: 1 }];

  // TODO: 結果を確認して埋めてください
  const result = service.calculateTotal(items);
  expect(result).toBe(5000);
});

test('特性化: 合計が10000円以上の場合、10%割引が適用される', () => {
  const items: Item[] = [{ name: 'パソコン', price: 10000, quantity: 1 }];

  // TODO: 送料なし + 10%割引の結果を確認して埋めてください
  const result = service.calculateTotal(items);
  expect(result).toBe(9000);
});

// ---------- applyDiscount の特性化テスト ----------

test('特性化: SALE10 コードで10%割引になる', () => {
  // TODO: 結果を確認して埋めてください
  const result = service.applyDiscount(1000, 'SALE10');
  expect(result).toBe(900);
});

test('特性化: 10000円超 + SALE10 でも 10% 割引のまま（バグ？）', () => {
  // ヒント: コードをよく読むと、「price > 10000 のとき 15% 割引」という
  //         意図があるが、実際にはその行に到達しない。
  //         「今の挙動」を記録してください。
  const result = service.applyDiscount(15000, 'SALE10');
  expect(result).toBe(13500);
  // TODO: バグを見つけたらここにコメントで記録してください
  // バグの内容: 10%割引のif文で早期リターンしているため
});

// ---------- formatReceipt の特性化テスト ----------

test('特性化: レシートが正しくフォーマットされる', () => {
  const items: Item[] = [
    { name: 'りんご', price: 200, quantity: 2 },
    { name: 'バナナ', price: 100, quantity: 3 },
  ];
  const total = 1200;

  // TODO: 実際の出力を確認して埋めてください
  const result = service.formatReceipt(items, total);
  expect(result).toBe("りんご x2 = 400円\nバナナ x3 = 300円\n合計: 1200円");
});
