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

  async fetchAll(_req: any, res: any) {
    try {
      const todos = await this.todoService.fetchAll();
      res.status(200).json(todos);
    } catch (error) {
      res.status(400).json({ error: 'データの取得に失敗しました' });
    }
  }

  async delete(req: any, res: any) {
    try {
      await this.todoService.deleteById(Number(req.params.id));
      res.status(204).json({ success: true });
    } catch (error) {
      res.status(404).json({ error: 'データが見つかりません' });
    }
  }
}

export = TodoController;
