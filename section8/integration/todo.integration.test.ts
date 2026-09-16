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
  const duplicateResponse = await request(app).post('/todos').send({ title: '重複テスト' });

  expect(duplicateResponse.status).toBe(400);
  expect(duplicateResponse.body.error).toBe('errormessage');
});