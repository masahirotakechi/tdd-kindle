export {};

const request = require('supertest');
const express = require('express');

// ホンモノを使用する
const TodoService = require('../service/todoService');
const TodoRepository = require('../repository/todoRepository');
const TodoController = require('../controller/todoController');

test('統合テスト: Todoの作成から取得まで', async () => {
  // 本物の依存関係を組み立てる
  const repository = new TodoRepository();
  const service = new TodoService(repository);
  const controller = new TodoController(service);

  // Expressアプリを組み立てる
  const app = express();
  app.use(express.json());
  app.post('/todos', (req: any, res: any) => controller.create(req, res));

  // 実際にTodoを作成
  const createResponse = await request(app)
    .post('/todos')
    .send({ title: '統合テスト' });

  expect(createResponse.status).toBe(201);
  expect(createResponse.body.title).toBe('統合テスト');
  expect(createResponse.body.id).toBeDefined();
});

test('統合テスト: 重複エラーが正しく返される', async () => {
  // 本物の依存関係を組み立てる
  const repository = new TodoRepository();
  const service = new TodoService(repository);
  const controller = new TodoController(service);

  // Expressアプリを組み立てる
  const app = express();
  app.use(express.json());
  app.post('/todos', (req: any, res: any) => controller.create(req, res));

  // まず一つ目のTodoを作成
  await request(app).post('/todos').send({ title: '重複テスト' });

  // 同じタイトルで再度作成しようとする
  const duplicateResponse = await request(app)
    .post('/todos')
    .send({ title: '重複テスト' });

  expect(duplicateResponse.status).toBe(400);
  expect(duplicateResponse.body.error).toBe('onaji title ga arimasu');
});

// ---------- 演習問題1 GET機能 ----------
test('統合テスト: GET機能', async () => {
  // 本物の依存関係を組み立てる
  const repository = new TodoRepository();
  const service = new TodoService(repository);
  const controller = new TodoController(service);

  // Expressアプリを組み立てる
  const app = express();
  app.use(express.json());
  app.get('/todos', (req: any, res: any) => controller.fetchAll(req, res));
  app.post('/todos', (req: any, res: any) => controller.create(req, res));

  // まず一つ目のTodoを作成
  await request(app).post('/todos').send({ title: 'ジムに行く' });

  // 検証
  const todos = await request(app).get('/todos').send();
  expect(todos.body.length).toBe(1);
});

// ---------- 演習問題2 DELETE機能 ----------
test('統合テスト: DELETE機能', async () => {
  // 本物の依存関係を組み立てる
  const repository = new TodoRepository();
  const service = new TodoService(repository);
  const controller = new TodoController(service);

  // Expressアプリを組み立てる
  const app = express();
  app.use(express.json());
  app.get('/todos', (req: any, res: any) => controller.fetchAll(req, res));
  app.post('/todos', (req: any, res: any) => controller.create(req, res));
  app.delete('/todos/:id', (req: any, res: any) => controller.delete(req, res));

  // まず一つ目のTodoを作成
  await request(app).post('/todos').send({ title: 'ジムに行く' });

  const todosBeforeDelete = await request(app).get('/todos').send();
  expect(todosBeforeDelete.body.length).toBe(1);

  // 作成したTodoを削除（IDはURLパラメータで渡す）
  await request(app).delete('/todos/1');

  // 削除済みか検証
  const todosAfterDelete = await request(app).get('/todos').send();
  expect(todosAfterDelete.body.length).toBe(0);
});

// ---------- 演習問題3 ----------
// なぜ統合テストではなく単体テストを多く書くべきなのでしょうか？ 統合テストだけで十分ではない理由を考えてください。

// 自分の回答：アプリケーションはmodel, repository, service, controllerの集まりだから、それらを十分にテストしないと、バグが発生する可能性が高まるから

// AIの回答：
// 単体テストを多く書くべき主な理由は3つ。
//
// 1. 失敗箇所の特定が速い
//    統合テストが落ちても「どの層のバグか」を追わなければならない。
//    単体テストが落ちれば「この関数のこの条件」とすぐわかる。
//
// 2. テストが速い・安定している
//    統合テストは HTTP サーバー・DB・全層を通すため遅く、
//    外部依存で不安定になりやすい。単体テストはモックで完結するため高速で安定する。
//
// 3. 境界条件・異常系を網羅しやすい
//    統合テストで「タイトルが空」「重複あり」「ID不正」など全パターンを書くと
//    テストの組み合わせが爆発する。単体テストなら各層ごとに独立して網羅できる。
//
// 自分の回答への補足：
// 「各層を十分にテストする」という方向性は正しい。
// そのための手段として単体テストが優れているのは、
// 「速さ・特定しやすさ・網羅しやすさ」の3点があるから。
// 統合テストは「層をまたいだ接続が正しいか」を確認する最終確認として少数書くのがセオリー。
