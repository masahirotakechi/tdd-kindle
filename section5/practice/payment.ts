class PaymentProcessor {
  private bonusPossibility: number = 0.1; // 10%の確率でボーナスが付く
  private bonusPointsRate: number = 0.01; // ボーナスポイントの付与率
  private api: any;

  constructor(api: any) {
    this.api = api;
  }

  pay(
    amount: number,
    cardNumber: string,
    email: string,
  ): {
    success: boolean;
    message?: string;
    error?: string;
    bonusPoints?: number;
  } {
    // 外部から受け取ったAPIを使う
    const result = this.api.charge(amount, cardNumber);

    if (result.success) {
      // ボーナスポイントを加算
      const bonusPoints = this.bonus(amount);

      // 領収書を送信
      const sendReceiptEmail = this.api.sendReceiptEmail(
        amount,
        cardNumber,
        email,
      );

      if (sendReceiptEmail.success === true) {
        return {
          success: true,
          message: '領収書送信完了',
          bonusPoints: bonusPoints,
        };
      }
      return { success: false, error: '領収書送信失敗' };
    }
    return { success: false, error: '支払い失敗' };
  }

  bonus(amount: number): number {
    // return Math.random() < this.bonusPossibility; // 10%の確率でボーナスが付く
    return this.api.bonusRandom() <= this.bonusPossibility // 10%の確率でボーナスが付く
      ? amount * this.bonusPointsRate
      : 0;
  }

  // sendReceiptEmail(
  //   amount: number,
  //   cardNumber: string,
  //   email: string,
  // ): {
  //   success: boolean;
  //   message?: string;
  //   error?: string;
  //   bonusPoints?: number;
  // } {
  //   // 支払いを行い、成功した場合に領収書を送信する
  //   const receipt = this.api.sendReceipt(amount, email);
  //   if (receipt.success === true) {
  //     return {
  //       success: true,
  //       message: '領収書送信完了',
  //       bonusPoints: this.bonus(amount),
  //     };
  //   } else {
  //     return { success: false, error: '領収書送信失敗' };
  //   }
  // }
}

export = PaymentProcessor;
