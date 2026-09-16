
class TodoController {
  private todoService: any;

  constructor(todoService: any) {
    this.todoService = todoService;
  }

  async create(req: any, res: any) {
    try {
      const title = req.body.title;
      const todo = await this.todoService.create(title);
      res.status(201).json(todo);
    } catch (error) {
      res.status(400).json({ error: 'onaji title ga arimasu' });
    }
  }

  async fetchAll(req: any, res: any) {
    try {
      const todos = await this.todoService.fetchAll();
      res.status(200).json(todos);
    } catch (error) {
      res.status(400).json({ error: 'Failed to fetch todos' });
    }
  }
}

export = TodoController;
