const NUMBER = 1;

class TodoList {
  constructor(list = []) {
    this.todoList = JSON.parse(JSON.stringify(list));
  }

  getTodo(id) {
    return this.todoList.find(todo => todo.id === +id);
  }

  addTodo(title) {
    const [lastTask] = this.todoList.slice(-NUMBER);
    const id = lastTask ? lastTask.id + NUMBER : NUMBER;
    this.todoList.push({ id, title, tasks: [] });
    return true;
  }

  removeTodo(id) {
    const todoIndex = this.todoList.findIndex(task => task.id === +id);
    if (todoIndex === -NUMBER) {
      return false;
    }
    this.todoList.splice(todoIndex, NUMBER);
    return true;
  }

  addTask(id, work) {
    const todo = this.getTodo(id);
    if (!todo) {
      return false;
    }
    const [lastTask] = todo.tasks.slice(-NUMBER);
    const taskId = lastTask ? lastTask.id + NUMBER : NUMBER;
    todo.tasks.push({ id: taskId, work, isDone: false });
    return true;
  }

  removeTask(todoId, taskId) {
    const todo = this.getTodo(todoId);
    if (!todo) {
      return false;
    }
    const taskIndex = todo.tasks.findIndex(task => task.id === +taskId);
    if (taskIndex === -NUMBER) {
      return false;
    }
    todo.tasks.splice(taskIndex, NUMBER);
    return true;
  }

  renameTodo(newTitle, todoId) {
    const todo = this.getTodo(todoId);
    if (!todo) {
      return false;
    }
    todo.title = newTitle;
    return true;
  }

  renameTask(newTitle, todoId, taskId) {
    const todo = this.getTodo(todoId);
    if (!todo) {
      return false;
    }
    const task = todo.tasks.find(task => task.id === +taskId);
    if (!task) {
      return false;
    }
    task.work = newTitle;
    return true;
  }

  changeStatus(todoId, taskId) {
    const todo = this.getTodo(todoId);
    if (!todo) {
      return false;
    }
    const task = todo.tasks.find(task => task.id === +taskId);
    if (!task) {
      return false;
    }
    task.isDone = !task.isDone;
    return true;
  }
}

module.exports = TodoList;
