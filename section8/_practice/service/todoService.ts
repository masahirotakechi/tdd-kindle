class TodoService {
  private repo: any;

  constructor(repo: any) {
    this.repo = repo;
  }

  async create(title: string) {
    // タイトルが空かどうかをチェック
    if (!title || title.trim() === '') {
      return Promise.reject(new Error('タイトルが空です'));
    }

    // 同じタイトルのTodoが存在するかをチェック
    const existingTodo = await this.repo.findByTitle(title);
    if (existingTodo) {
      return Promise.reject(new Error('同じタイトルのToDoは作れません'));
    }

    // 新しいTodoを作成
    const todo = { title, completed: false };
    return this.repo.save(todo);
  }

  async fetchAll() {
    return this.repo.fetchAll();
  }

  async deleteById(id: number) {
    // IDが空かどうかをチェック
    if (!id) {
      return Promise.reject(new Error('IDが空です'));
    }

    // 同じIDのTodoが存在するかをチェック
    const todo = await this.repo.findById(id);
    if (!todo) {
      return Promise.reject(new Error('todoが存在しません'));
    }

    return this.repo.deleteById(id);
  }
}

export = TodoService;