
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
}

export = TodoRepository;
