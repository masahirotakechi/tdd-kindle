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

// 演習問題1: Modelの拡張: Todoクラスに「未完了に戻す」メソッドincomplete()をTDDで追加してください。
test('Todoの未完了状態に戻せる', async () => {
  const todo = new Todo('ジムに行く');
  await todo.complete();
  expect(todo.completed).toBe(true);

  await todo.incomplete();
  expect(todo.completed).toBe(false);
});

// 演習問題3: 考察: なぜModel層のテストでは、Repository層やデータベースのことを一切考えなくてよいのでしょうか？
// 自分の答え：それぞれが分離しており、依存していないから。
// AIの答え：Model層のテストは、あくまでTodoオブジェクトの振る舞いを確認するものであり、データの永続化やRepositoryの実装には依存しないため。
