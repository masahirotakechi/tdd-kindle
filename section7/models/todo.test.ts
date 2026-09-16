export {};
const Todo = require('./todo');

test('Todoはタイトルを持ち、初期状態は未完了である', () => {
  const todo = new Todo('ジムに行く');

  expect(todo.title).toBe('ジムに行く');
  expect(todo.completed).toBe(false);
});

test('Todoの完了状態を変更できる', async () => {
  const todo = new Todo('ジムに行く');

  await todo.complete();
  expect(todo.completed).toBe(true);
});
