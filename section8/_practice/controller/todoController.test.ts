const request = require('supertest');
const express = require('express');
const TodoController = require('./todoController');

test('POST /todos', async () => {
  // Serviceのモックを作る
  // create() を呼ぶと常に成功し、固定の Todo オブジェクトを返すモックを定義
  const mockService = {
    create: jest
      .fn()
      .mockResolvedValue({ id: 1, title: 'ジムに行く', completed: false }),
  };

  // Controllerを作成
  // 本物の Service の代わりにモックを注入してインスタンス化
  const controller = new TodoController(mockService);

  // Expressアプリを組み立てる
  const app = express();
  app.use(express.json()); // リクエストボディの JSON を自動的に req.body へパース
  app.post('/todos', (req: any, res: any) => controller.create(req, res)); // ルートにコントローラーを紐付け

  // HTTPリクエストを送信
  // supertest が実際の HTTP サーバーを立てずにリクエストを発行する
  const response = await request(app)
    .post('/todos')
    .send({ title: 'ジムに行く' }); // JSON ボディとして送信

  // レスポンスを検証
  expect(response.status).toBe(201); // 作成成功のステータスコード
  expect(response.body.title).toBe('ジムに行く'); // 返却データの title を確認
  expect(mockService.create).toHaveBeenCalledWith('ジムに行く'); // Service が正しい引数で呼ばれたか確認
  expect(response.body.completed).toBe(false); // 初期値は未完了であることを確認
});

test('Serviceのcreateが失敗した場合', async () => {
  // create() を呼ぶと必ず Error をスローするモックを定義（失敗シナリオの再現）
  const mockService = {
    create: jest.fn().mockRejectedValue(new Error('タイトルは必須です')),
  };

  // コントローラーの作成
  const controller = new TodoController(mockService);

  // Expressアプリを組み立てる
  const app = express();
  app.use(express.json()); // リクエストボディの JSON を自動的に req.body へパース
  app.post('/todos', (req: any, res: any) => controller.create(req, res)); // ルートにコントローラーを紐付け

  // HTTPリクエストを送信
  // 空の title を送ることで Service がエラーを返すケースを再現
  const response = await request(app).post('/todos').send({ title: '' });

  // レスポンスを検証
  // Service がエラーをスローした場合、Controller は 400 を返すことを確認
  expect(response.status).toBe(400);
  expect(response.body.error).toBe('onaji title ga arimasu');
});

// ----------- 演習問題1 -----------
//  ServiceのfetchAllが正常に動作するかをテスト
test('GET /todos', async () => {
  // Serviceのモックを作る
  // fetchAll() を呼ぶと常に成功し、固定の Todo 配列を返すモックを定義
  const mockService = {
    fetchAll: jest.fn().mockResolvedValue([
      { id: 1, title: 'ジムに行く', completed: false },
      { id: 2, title: '買い物に行く', completed: false },
    ]),
  };

  // Controllerを作成
  // 本物の Service の代わりにモックを注入してインスタンス化
  const controller = new TodoController(mockService);

  // Expressアプリを組み立てる
  const app = express();
  app.use(express.json()); // リクエストボディの JSON を自動的に req.body へパース
  app.get('/todos', (req: any, res: any) => controller.fetchAll(req, res)); // ルートにコントローラーを紐付け

  // HTTPリクエストを送信
  // supertest が実際の HTTP サーバーを立てずにリクエストを発行する
  const response = await request(app).get('/todos');

  // レスポンスを検証
  expect(response.status).toBe(200); // 取得成功のステータスコード
  expect(response.body).toEqual([
    // モックが返した配列がそのままレスポンスに含まれるか確認
    { id: 1, title: 'ジムに行く', completed: false },
    { id: 2, title: '買い物に行く', completed: false },
  ]);
});

// ----------- 演習問題1 -----------
//  ServiceのfetchAllが失敗した場合をテスト
test('ServiceのfetchAllが失敗した場合', async () => {
  // fetchAll() を呼ぶと必ず Error をスローするモックを定義（失敗シナリオの再現）
  const mockService = {
    fetchAll: jest
      .fn()
      .mockRejectedValue(new Error('mockService データの取得に失敗しました')),
  };

  // Controllerを作成
  // 本物の Service の代わりにモックを注入してインスタンス化
  const controller = new TodoController(mockService);

  // Expressアプリを組み立てる
  const app = express();
  app.get('/todos', (req: any, res: any) => controller.fetchAll(req, res)); // ルートにコントローラーを紐付け

  // HTTPリクエストを送信
  // supertest が実際の HTTP サーバーを立てずにリクエストを発行する
  const response = await request(app).get('/todos');

  // レスポンスを検証
  // Service がエラーをスローした場合、Controller は 400 とエラーメッセージを返すことを確認
  expect(response.status).toBe(400);
  expect(response.body.error).toBe('データの取得に失敗しました');
});

// ----------- 演習問題2 -----------
// 「DELETE /todos/:id でToDoを削除する」
test('DELETE /todos/:id でToDoを削除する', async () => {
  // arrange
  // - モックServiceを作成
  const mockService = {
    deleteById: jest.fn().mockResolvedValue(undefined),
  };

  // - コントローラーを初期化
  const controller = new TodoController(mockService);

  // - Expressアプリを組み立て
  const app = express();
  app.use(express.json());
  app.delete('/todos/:id', (req: any, res: any) => controller.delete(req, res));

  // act
  // - HTTPリクエストを送信
  // supertest が実際の HTTP サーバーを立てずにリクエストを発行する
  const response = await request(app).delete('/todos/1');

  // assert
  // - レスポンスを検証
  expect(response.status).toBe(204);
  expect(mockService.deleteById).toHaveBeenCalledWith(1);
});

// ----------- 演習問題2 -----------
// 存在しないIDの場合は404を返す
test('DELETE /todos/:id 存在しないIDの場合は404を返す', async () => {
  // arrange
  // - モックServiceを作成
  const mockService = {
    deleteById: jest
      .fn()
      .mockRejectedValue(new Error('mockService 存在しないIDです')),
  };

  // - コントローラーを初期化
  const controller = new TodoController(mockService);

  // - Expressアプリを組み立て
  const app = express();
  app.use(express.json());
  app.delete('/todos/:id', (req: any, res: any) => {
    controller.delete(req, res);
  });

  // act
  // - HTTPリクエストを送信
  const response = await request(app)
    .delete('/todos/:id')
    .send({ id: 'not-exist' });

  // assert
  // - レスポンスを検証
  expect(response.status).toBe(404);
  expect(response.body.error).toBe('データが見つかりません');
});
