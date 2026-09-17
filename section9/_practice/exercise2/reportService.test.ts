// 演習問題2: 接合部（Seam）の発見とテスト
//
// 目標: ReportService の3つの関数をデフォルト引数で接合部化し、
//       テストで依存を差し替えられるようにする。
//
// 手順:
//   1. reportService.ts の各関数にデフォルト引数を追加する
//      例: generateReport(title: string, logger = console.log)
//   2. テスト内では差し替えた依存を渡してテストを通す

import { ReportService } from './reportService';

const service = new ReportService();

// ---------- 演習2-1: logger を差し替える ----------
test('generateReport: logger にレポート文字列が渡される', () => {
  // TODO: jest.fn() で logger を作り、generateReport の引数に渡してください
  const mockLogger = jest.fn();
  service.generateReport('月次レポート', mockLogger);
  expect(mockLogger).toHaveBeenCalledWith('[レポート] 月次レポート');
});

// ---------- 演習2-2: Date.now を差し替える ----------
test('createTimestamp: 固定した時刻が返される', () => {
  // TODO: 固定の時刻関数を渡し、結果を検証してください
  const fixedNow = new Date('2024-01-01T00:00:00.000Z').getTime();
  const result = service.createTimestamp(fixedNow);
  expect(result).toBe('2024-01-01T00:00:00.000Z');
});

// ---------- 演習2-3: Math.random を差し替える ----------
test('assignReviewerId: ランダム関数を固定して常に最初のレビュアーを返す', () => {
  const reviewers = ['田中', '鈴木', '佐藤'];

  // TODO: random を常に 0 を返す関数に差し替え、結果を検証してください
  const alwaysFirst = () => 0;
  const result = service.assignReviewerId(reviewers, alwaysFirst);
  expect(result).toBe('田中');
});

test('assignReviewerId: ランダム関数を固定して最後のレビュアーを返す', () => {
  const reviewers = ['田中', '鈴木', '佐藤'];

  // TODO: random を 0.99 を返す関数に差し替え、結果を検証してください
  const alwaysLast = () => 0.99;
  const result = service.assignReviewerId(reviewers, alwaysLast);
  expect(result).toBe('佐藤');
});
