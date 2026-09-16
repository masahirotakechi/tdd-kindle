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

  save(title: string) {
    const saved = { title: title, completed: false, id: this.nextId++ };
    this.todos.push(saved);
    return saved;
  }

  findById(id: number): Todo | undefined {
    return this.todos.find((todo) => todo.id === id) || undefined;
  }

  findAll(): Todo[] {
    return this.todos;
  }
}

export = TodoRepository;
