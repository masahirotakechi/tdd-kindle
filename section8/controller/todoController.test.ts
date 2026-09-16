export {};

const request = require('supertest');
const express = require('express');
const TodoController = require('./todoController');

test('POST /todos', async () => {
  // Serviceのモックを作る
  const mockService = {
    create: jest
      .fn()
      .mockResolvedValue({ id: 1, title: 'ジムに行く', completed: false }),
  };

  // Controllerを作成
  const controller = new TodoController(mockService);

  // Expressアプリを組み立てる
  const app = express();
  app.use(express.json());
  app.post('/todos', (req: any, res: any) => controller.create(req, res));

  // HTTPリクエストを送信
  const response = await request(app)
    .post('/todos')
    .send({ title: 'ジムに行く' });

  // レスポンスを検証
  expect(response.status).toBe(201);
  expect(response.body.title).toBe('ジムに行く');
  expect(mockService.create).toHaveBeenCalledWith('ジムに行く');
  expect(response.body.completed).toBe(false);
});

test('Serviceのcreateが失敗した場合', async () => {
  const mockService = {
    create: jest.fn().mockRejectedValue(new Error('タイトルは必須です')),
  };

  // コントローラーの作成
  const controller = new TodoController(mockService);

  // Expressアプリを組み立てる
  const app = express();
  app.use(express.json());
  app.post('/todos', (req: any, res: any) => controller.create(req, res));

  // HTTPリクエストを送信
  const response = await request(app).post('/todos').send({ title: '' });

  // レスポンスを検証
  expect(response.status).toBe(400);
  expect(response.body.error).toBe('errormessage');
});
