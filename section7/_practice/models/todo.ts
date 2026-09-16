class Todo {
  private title: string;
  private completed: boolean;

  constructor(title: string) {
    this.title = title;
    this.completed = false;
  }

  async complete() {
    this.completed = true;
  }

  async incomplete() {
    this.completed = false;
  }

  getTitle() {
    return this.title;
  }

  isCompleted() {
    return this.completed;
  }
}

export = Todo;