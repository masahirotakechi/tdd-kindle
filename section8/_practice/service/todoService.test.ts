export {};
const TodoService = require('./todoService');

// 正常系
test('Todoを作成できる', async () => {
  // 1. repoを作成f
  const mockRepo = {
    save: jest
      .fn()
      .mockReturnValue({ id: 1, title: 'ジムに行く', completed: false }),
    findByTitle: jest.fn().mockReturnValue(null), // 既存なし
  };

  // 2. サービスを作成
  const service = new TodoService(mockRepo);

  // 3. サービスを使ってTodoを作成
  const createdTodo = await service.create('ジムに行く');

  // 4. 結果を検証
  expect(createdTodo).toEqual({ id: 1, title: 'ジムに行く', completed: false });
  expect(mockRepo.save).toHaveBeenCalledWith({
    title: 'ジムに行く',
    completed: false,
  });
});

// 演習問題1: Todoを取得できるかどうかをテスト
test('Todoを取得できる', async () => {
  // 1. repoを作成
  const mockRepo = {
    save: jest.fn(),
    findById: jest.fn(),
    findByTitle: jest.fn(),
    fetchAll: jest.fn().mockReturnValue([
      {
        id: 1,
        title: 'ジムに行く',
        completed: false,
      },
      {
        id: 2,
        title: '買い物に行く',
        completed: false,
      },
    ]),
  };

  // 2. サービスを作成
  const service = new TodoService(mockRepo);

  // 3. サービスを使ってTodoを作成
  const todos = await service.fetchAll();

  // 4. 結果を検証
  expect(todos).toEqual([
    {
      id: 1,
      title: 'ジムに行く',
      completed: false,
    },
    {
      id: 2,
      title: '買い物に行く',
      completed: false,
    },
  ]);
});

test('重複がなければ、Todoを作成できる', async () => {
  // 1. repoを作成
  const mockRepo = {
    save: jest
      .fn()
      .mockReturnValue({ id: 1, title: 'ジムに行く', completed: false }),
    findByTitle: jest.fn().mockReturnValue(null), // 既存なし
  };

  // 2. サービスを作成
  const service = new TodoService(mockRepo);

  // 3. サービスを使ってTodoを作成
  const createdTodo = await service.create('ジムに行く');

  // 4. 結果を検証
  expect(createdTodo.title).toEqual('ジムに行く');
  expect(mockRepo.findByTitle).toHaveBeenCalledWith('ジムに行く');
  expect(mockRepo.save).toHaveBeenCalledWith({
    title: 'ジムに行く',
    completed: false,
  });
});

// 異常系
test('タイトルが空の場合、エラーになる', async () => {
  // 1. repoを作成
  const mockRepo = {
    save: jest.fn(),
    findByTitle: jest.fn().mockReturnValue(null), // 既存なし
  };

  // 2. サービスを作成
  const service = new TodoService(mockRepo);

  // 3. サービスを使ってTodoを作成
  const createdTodo = service.create('');

  // 4. 結果を検証
  await expect(createdTodo).rejects.toThrow('タイトルが空です');
  expect(mockRepo.save).not.toHaveBeenCalled();
});

// 異常系
test('同じタイトルが存在する場合、エラーになる', async () => {
  // 1. repoを作成
  const mockRepo = {
    save: jest.fn(),
    findByTitle: jest
      .fn()
      .mockReturnValue({ id: 1, title: 'ジムに行く', completed: false }),
  };

  // 2. サービスを作成
  const service = new TodoService(mockRepo);

  // 3. サービスを使ってTodoを取得
  await expect(service.create('ジムに行く')).rejects.toThrow(
    '同じタイトルのToDoは作れません',
  );

  // 4. 結果を検証
  expect(mockRepo.save).not.toHaveBeenCalled();
});
