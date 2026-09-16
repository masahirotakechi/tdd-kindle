/**
 * 注文管理クラス（リファクタリング演習用）
 *
 * このコードには以下の問題が意図的に埋め込まれています：
 *
 * 【問題1】長いメソッド
 *   processOrder() が長すぎます。
 *   バリデーション・割引計算・注文確定の3つのメソッドに分割してください。
 *
 * 【問題2】マジックナンバー
 *   ステータスの数値（1〜5）が意味不明です。
 *   定数に置き換えて意味を明確にしてください。
 *
 * 【問題3】重複コード
 *   割引計算のロジックが processOrder() と generateInvoice() の2箇所に書かれています。
 *   共通のメソッドにまとめてください。
 */

type Order = {
  id: string;
  customerId: string;
  items: { name: string; price: number; quantity: number }[];
  status: number;
  memberRank: 'normal' | 'silver' | 'gold';
};

type ProcessResult = {
  success: boolean;
  message?: string;
  error?: string;
  totalAmount?: number;
};

type Invoice = {
  orderId: string;
  subtotal: number;
  discount: number;
  total: number;
};

const orderStatus = {
  RECEIVED: 1,
  PROCESSING: 2,
  SHIPPED: 3,
  DELIVERED: 4,
  CANCELED: 5,
};

class OrderManager {
  private orders: Map<string, Order> = new Map();

  addOrder(order: Order): void {
    this.orders.set(order.id, order);
  }

  // 【問題1】このメソッドが長すぎる。3つのメソッドに分割せよ。
  // 【問題2】status の数値がマジックナンバー
  // 【問題3】割引計算が generateInvoice と重複している
  processOrder(orderId: string): ProcessResult {
    const order = this.orders.get(orderId);

    if (!order) {
      return { success: false, error: '注文が見つかりません' };
    }

    // --- バリデーション ---
    const validationResult = this.validate(order);
    if (!validationResult.success) {
      return validationResult;
    }

    // --- 割引計算 ---
    const totalAmount = this.calculateTotalAmount(
      order.memberRank,
      validationResult.subtotal!,
    );

    // --- 注文確定 ---
    return this.finalizeOrder(order, totalAmount);
  }

  validate(
    order: Order,
  ): { success: false; error: string } | { success: true; subtotal: number } {
    if (order.items.length === 0) {
      return { success: false, error: '商品が1件もありません' };
    }
    if (order.status !== orderStatus.RECEIVED) {
      return { success: false, error: 'この注文はすでに処理済みです' };
    }
    const subtotal = this.calculateSubTotal(order);
    if (subtotal <= 0) {
      return { success: false, error: '合計金額が不正です' };
    }
    return { success: true, subtotal };
  }

  calculateSubTotal(order: Order): number {
    return order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }

  calculateTotalAmount(
    rank: 'normal' | 'silver' | 'gold',
    subtotal: number,
  ): number {
    let discount = 0;
    if (rank === 'silver') {
      discount = subtotal * 0.05;
    } else if (rank === 'gold') {
      discount = subtotal * 0.1;
    }
    if (subtotal >= 10_000) {
      discount += subtotal * 0.03;
    }
    const totalAmount = subtotal - discount;
    return totalAmount;
  }

  finalizeOrder(
    order: Order,
    totalAmount: number,
  ): { success: true; message: string; totalAmount: number } {
    order.status = orderStatus.PROCESSING;
    this.orders.set(order.id, order);

    return {
      success: true,
      message: '注文を受け付けました',
      totalAmount,
    };
  }

  // 【問題2】status の数値がマジックナンバー
  getStatus(orderId: string): string {
    const order = this.orders.get(orderId);
    if (!order) return '不明';

    if (order.status === orderStatus.RECEIVED) return '受付中';
    if (order.status === orderStatus.PROCESSING) return '処理中';
    if (order.status === orderStatus.SHIPPED) return '発送済み';
    if (order.status === orderStatus.DELIVERED) return '配達完了';
    if (order.status === orderStatus.CANCELED) return 'キャンセル';
    return '不明';
  }

  // 【問題3】割引計算が processOrder と重複している
  generateInvoice(orderId: string): Invoice | null {
    const order = this.orders.get(orderId);
    if (!order) return null;

    const subtotal = this.calculateSubTotal(order);
    const totalAmount = this.calculateTotalAmount(order.memberRank, subtotal);
    const discount = subtotal - totalAmount;

    return {
      orderId,
      subtotal,
      discount,
      total: totalAmount,
    };
  }
}

export = OrderManager;
