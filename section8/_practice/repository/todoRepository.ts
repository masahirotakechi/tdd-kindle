type Todo = {
  title: string;
  completed: boolean;
  id?: number;
};

class TodoRepository {
  todos: Todo[];
  nextId: number;

  constructor() {
    this.todos = [];
    this.nextId = 1;
  }

  save(todo: Todo) {
    const saved = { ...todo, id: this.nextId++ };
    this.todos.push(saved);
    return saved;
  }

  findById(id: number): Todo | undefined {
    return this.todos.find((todo) => todo.id === id) || undefined;
  }

  findByTitle(title: string): Todo | null {
    return this.todos.find((todo) => todo.title === title) || null;
  }

  fetchAll(): Todo[] {
    return this.todos;
  }

  // 自分の元のコード
  // deleteById(id: number) {
  //   const todo = this.findById(id);
  //   if (!todo) return '存在しないデータです';

  //   this.todos = this.todos.filter((todo) => todo.id !== id);
  // }

  // 修正後：「存在しないならエラーというビジネスルールを持つ必要はない
  deleteById(id: number) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }
}

export = TodoRepository;
