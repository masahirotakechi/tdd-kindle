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
}

export = TodoService;