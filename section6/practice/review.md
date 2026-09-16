# コードレビュー — refactorAfter.ts

## 総評

3つの問題はすべて解決できています。特に `validate()` の返り型に discriminated union（`{ success: false } | { success: true; subtotal: number }`）を使っているのは中級レベルとして上出来です。

---

## 良かった点

### 問題1（長いメソッド）◎
`processOrder()` が `validate()` → `calculateTotalAmount()` → `finalizeOrder()` の3段階に綺麗に分割できています。各メソッドの責務が明確です。

### 問題2（マジックナンバー）○
`orderStatus` 定数オブジェクトを定義して全箇所で統一して使えています。

### 問題3（重複の排除）◎
`calculateSubTotal()` と `calculateTotalAmount()` を共通メソッドにまとめ、両方から呼べるようにできています。

---

## 指摘事項

### [修正必須] バグ: discountの符号が逆（L156）

`totalAmount < subtotal` なので、引き算の向きが逆だと負の数になります。

```ts
// 現在（バグ）
const discount = totalAmount - subtotal;

// 正しい
const discount = subtotal - totalAmount;
```

### [改善] `orderStatus` を `as const` で型安全にする（L41）

現状は `orderStatus.RECEIVED` の型が `number` になっています。`as const` をつけると `1` というリテラル型になり、意図しない値の代入をコンパイラが検出できます。

```ts
const orderStatus = {
  RECEIVED: 1,
  PROCESSING: 2,
  SHIPPED: 3,
  DELIVERED: 4,
  CANCELED: 5,
} as const;
```

### [提案] `calculateTotalAmount` という名前が少し曖昧（L105）

「合計金額を計算する」と読めますが、実際は「割引を適用した後の金額を返す」メソッドです。`calculateDiscountedAmount()` や `applyDiscount()` のほうが意図が伝わりやすいです。

---

## まとめ

| 項目 | 評価 |
|---|---|
| 問題1（長いメソッド分割） | ◎ |
| 問題2（マジックナンバー） | ○ |
| 問題3（重複排除） | ◎ |
| バグなし | △（discountの符号ミス） |

`discount` のバグだけ直せば完成です。
