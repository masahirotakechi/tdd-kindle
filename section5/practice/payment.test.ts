/**
 * PaymentProcessorクラスのテスト
 *
 * 通知機能のテスト:
 * 「支払いが完了したらメールを送る」という機能を追加し、
 * メール送信部分をモックにして「メールが1回送信されたこと」をテストしてください。
 * ランダムの制御:
 * 「10%の確率でボーナスポイントがつく」機能を実装し、
 * Math.random() をモックして、必ずボーナスが当たるケースと外れるケースをテストしてください（ヒント: jest.spyOn(Math, 'random') を使います）。
 */

import PaymentProcessor = require('./payment');

describe('PaymentProcessor', () => {
  // 正常系
  test('正常に支払いが完了する', () => {
    // 正常に支払いが完了するモックを作成
    const mockApi = {
      charge: jest.fn().mockReturnValue({ success: true }),
      sendReceiptEmail: jest.fn().mockReturnValue({ success: true }),
      bonusRandom: jest.fn().mockReturnValue(0.5),
    };

    const processor = new PaymentProcessor(mockApi);
    const result = processor.pay(
      1_000,
      '1234-5678-1234-5678',
      'test@example.com',
    );

    expect(result).toEqual({
      success: true,
      message: '領収書送信完了',
      bonusPoints: 0,
    });

    expect(mockApi.charge).toHaveBeenCalledTimes(1);
    expect(mockApi.charge).toHaveBeenCalledWith(1_000, '1234-5678-1234-5678');

    expect(mockApi.sendReceiptEmail).toHaveBeenCalledTimes(1);
    expect(mockApi.sendReceiptEmail).toHaveBeenCalledWith(
      1_000,
      '1234-5678-1234-5678',
      'test@example.com',
    );

    expect(mockApi.bonusRandom).toHaveBeenCalledTimes(1);
  });

  test('ボーナスが付く', () => {
    // ボーナスが付くモックを作成
    const mockApi = {
      charge: jest.fn().mockReturnValue({ success: true }),
      sendReceiptEmail: jest.fn().mockReturnValue({ success: true }),
      bonusRandom: jest.fn().mockReturnValue(0.05),
    };

    const processor = new PaymentProcessor(mockApi);

    const result = processor.pay(
      1_000,
      '1234-5678-1234-5678',
      'test@example.com',
    );

    expect(result).toEqual({
      success: true,
      message: '領収書送信完了',
      bonusPoints: 10,
    });
  });

  test('ボーナスが付かない', () => {
    // ボーナスが付かないモックを作成
    const mockApi = {
      charge: jest.fn().mockReturnValue({ success: true }),
      sendReceiptEmail: jest.fn().mockReturnValue({ success: true }),
      bonusRandom: jest.fn().mockReturnValue(0.5),
    };

    const processor = new PaymentProcessor(mockApi);

    const result = processor.pay(
      1_000,
      '1234-5678-1234-5678',
      'test@example.com',
    );

    expect(result).toEqual({
      success: true,
      message: '領収書送信完了',
      bonusPoints: 0,
    });
  });

  // 異常系
  test('支払いが失敗する', () => {
    const mockApi = {
      charge: jest.fn().mockReturnValue({ success: false }),
      sendReceiptEmail: jest.fn(),
      bonusRandom: jest.fn(),
    };
    const processor = new PaymentProcessor(mockApi);
    const result = processor.pay(1000, '4111111111111111', 'test@example.com');
    expect(result).toEqual({ success: false, error: '支払い失敗' });
  });

  // 境界値系
  test('0.1だと、ボーナスが付く', () => {
    // ボーナスが付くモックを作成
    const mockApi = {
      charge: jest.fn().mockReturnValue({ success: true }),
      sendReceiptEmail: jest.fn().mockReturnValue({ success: true }),
      bonusRandom: jest.fn().mockReturnValue(0.1),
    };

    const processor = new PaymentProcessor(mockApi);

    const result = processor.pay(
      1_000,
      '1234-5678-1234-5678',
      'test@example.com',
    );

    expect(result).toEqual({
      success: true,
      message: '領収書送信完了',
      bonusPoints: 10,
    });
  });
});
