// 演習問題1: 特性化テストの実践
// テストのないレガシーな注文サービス。現状の挙動をそのまま記録する特性化テストを書いてください。

export type Item = {
  name: string;
  price: number;
  quantity: number;
};

export class OrderService {
  calculateTotal(items: Item[]): number {
    let total = 0;
    for (const item of items) {
      total += item.price * item.quantity;
    }

    // 5000円以上で送料無料、未満は500円加算
    if (total < 5000) {
      total += 500;
    }

    // 10000円以上で10%割引
    if (total >= 10000) {
      total = total * 0.9;
    }

    return total;
  }

  applyDiscount(price: number, discountCode: string): number {
    if (discountCode === 'SALE10') return price * 0.9;
    if (discountCode === 'SALE20') return price * 0.8;
    if (discountCode === 'SALE10' && price > 10000) return price * 0.85; // ← バグ: この行には到達しない
    return price;
  }

  formatReceipt(items: Item[], total: number): string {
    const lines = items.map(
      (item) => `${item.name} x${item.quantity} = ${item.price * item.quantity}円`
    );
    lines.push(`合計: ${total}円`);
    return lines.join('\n');
  }
}
