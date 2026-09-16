export {};
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

test('タイトルでTodoを検索できる', () => {
  const repo = new TodoRepository();
  repo.save({ title: 'ジムに行く', completed: false });
  repo.save({ title: 'ヨガに行く', completed: false });

  const found = repo.findByTitle('ジムに行く');

  expect(found.title).toBe('ジムに行く');
});

test('タイトルが存在しない場合はnullを返す', () => {
  const repo = new TodoRepository();
  repo.save({ title: 'ジムに行く', completed: false });
  repo.save({ title: 'ヨガに行く', completed: false });

  const found = repo.findByTitle('水泳に行く');

  expect(found).toBeNull();
});

// 演習問題1: GET機能の追加:
// 「GET /todos でToDo一覧を取得する」機能をTDDで実装してください。
// Repository → Service → Controllerの順で。

test('全てのTodoを取得できる', () => {
  const repo = new TodoRepository();
  repo.save({ title: 'ジムに行く', completed: false });
  repo.save({ title: 'ヨガに行く', completed: false });

  const allTodos = repo.fetchAll();
  expect(allTodos.length).toBe(2);
  expect(allTodos[0].title).toBe('ジムに行く');
  expect(allTodos[1].title).toBe('ヨガに行く');
});

// ---------- 演習問題2 ----------
// DELETE機能
// 「DELETE /todos/:id でToDoを削除する」機能
test('todoを削除できる', () => {
  const repo = new TodoRepository();
  repo.save({ id: 1, title: 'ジムに行く', completed: false });
  const allTodosBefore = repo.fetchAll();
  expect(allTodosBefore.length).toBe(1);

  console.log('allTodosBefore: ', allTodosBefore);
  // 削除する
  repo.deleteById(1);

  // 削除されていることを確認
  const allTodosAfter = repo.fetchAll();
  console.log('allTodosAfter: ', allTodosAfter);

  expect(allTodosAfter.length).toBe(0);
});

// ---------- 演習問題2 ----------
// DELETE機能
// 存在しないIDの場合は404を返す
test('存在しないIDの場合は404を返す', () => {
  const repo = new TodoRepository();

  // 存在しないIDをリクエスト
  const deleted = repo.deleteById(1);

  expect(repo.fetchAll()).toEqual([]);
});
