const TodoRepository = require('./todoRepository');

beforeEach(() => {
  jest.clearAllMocks();
});

test('Todoを保存すると、IDが割り振られる', () => {
  const repo = new TodoRepository();
  const todo = { title: 'ジムに行く', completed: false };

  const savedTodo = repo.save(todo);
  expect(savedTodo.id).toBeDefined();
  expect(savedTodo.title).toBe('ジムに行く');
  expect(savedTodo.completed).toBe(false);
});

test('Todoを取得できる', () => {
  const repo = new TodoRepository();
  const saved = repo.save({ title: 'ジムに行く', completed: false });

  const found = repo.findById(saved.id);
  expect(found).toEqual(saved);
  expect(found.title).toBe('ジムに行く');
  expect(found.completed).toBe(false);
});

test('IDが存在しない場合はundefinedを返す', () => {
  const repo = new TodoRepository();
  const found = repo.findById(999);
  expect(found).toBeUndefined();
});