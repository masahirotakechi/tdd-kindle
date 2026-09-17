// 演習問題2: 接合部（Seam）の発見と依存の注入
//
// この ReportService には console.log・Date.now()・Math.random() が直接埋め込まれており、
// テストが困難な状態です。
// デフォルト引数を使い、テスト可能なように変更してください。

export class ReportService {
  // 問題1: console.log が直接呼ばれていてテストで検証できない
  generateReport(
    title: string,
    logger: (report: string) => void = console.log,
  ): string {
    const report = `[レポート] ${title}`;
    logger(report);
    return report;
  }

  // 問題2: Date.now() が固定できないため、テストで結果が変わる
  createTimestamp(date: number): string {
    const now = date || Date.now(); // ← 接合部に変える
    return new Date(now).toISOString();
  }

  // 問題3: Math.random() が固定できないため、テストが不安定
  assignReviewerId(
    reviewers: string[],
    random: () => number = Math.random,
  ): string {
    const index = Math.floor(random() * reviewers.length);
    return reviewers[index];
  }

  // 自分のコード：バグあり
  // assignReviewerId(
  //   reviewers: string[],
  //   fixedNum: () => number = () => 0,
  // ): string {
  //   const num = fixedNum() || Math.random();
  //   const index = Math.floor(num * reviewers.length); // ← 接合部に変える
  //   return reviewers[index];
  // }
}
