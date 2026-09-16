export {};
const TodoRepository = require('./todoRepository');

beforeEach(() => {
  jest.clearAllMocks();
});

test('Todoを保存すると、IDが割り振られる', () => {
  const repo = new TodoRepository();

  const savedTodo = repo.save('ジムに行く');
  expect(savedTodo.id).toBeDefined();
  expect(savedTodo.title).toBe('ジムに行く');
  expect(savedTodo.completed).toBe(false);
});

test('Todoを取得できる', () => {
  const repo = new TodoRepository();
  const saved = repo.save('ジムに行く');

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

// 演習問題2: Repositoryの拡張: 「全てのToDoを取得する」findAll()メソッドをTDDで追加してください。
test('全てのTodoを取得できる', () => {
  const repo = new TodoRepository();
  const todo1 = repo.save('ジムに行く');
  const todo2 = repo.save('買い物に行く');

  const allTodos = repo.findAll?.();
  expect(allTodos).toContainEqual(todo1);
  expect(allTodos).toContainEqual(todo2);
  expect(allTodos.length).toBe(2);
});