const assert = require('chai').assert;
const TodoList = require('../lib/TodoList');

const list = [{
  'id': 1, 'title': 'deepika', 'tasks': [
    { 'id': 1, 'work': 'task1', 'isDone': false }
  ]
}];

describe('getTodo', function() {
  it('Should return the todo of given id', function() {
    const todoList = new TodoList(list);
    const actual = todoList.getTodo(1);
    const expected = {
      'id': 1, 'title': 'deepika', 'tasks': [
        { 'id': 1, 'work': 'task1', 'isDone': false }
      ]
    };
    assert.deepStrictEqual(actual, expected);
  });
});

describe('addTodo', function() {
  it('Should add new todo to the list given title', function() {
    const todoList = new TodoList(list);
    const todoAdded = todoList.addTodo('new title');
    assert.ok(todoAdded);
  });
});

describe('removeTodo', function() {
  it('Should remove the todo of the given id', function() {
    const todoList = new TodoList(list);
    const todoRemoved = todoList.removeTodo(1);
    assert.ok(todoRemoved);
  });
  it('Should return false if given todo id does not exist', function() {
    const todoList = new TodoList(list);
    const todoRemoved = todoList.removeTodo(20);
    assert.notOk(todoRemoved);
  });
});

describe('addTask', function() {
  it('Should add the new task to the given todoId', function() {
    const todoList = new TodoList(list);
    const taskAdded = todoList.addTask(1, 'new task');
    assert.ok(taskAdded);
  });
  it('Should not add task if todo is not present', function() {
    const todoList = new TodoList(list);
    const taskAdded = todoList.addTask(20, 'new task');
    assert.notOk(taskAdded);
  });
});

describe('removeTask', function() {
  it('Should remove the task, given todoId and taskId', function() {
    const todoList = new TodoList(list);
    const taskRemoved = todoList.removeTask(1, 1);
    assert.ok(taskRemoved);
  });
  it('Should not remove task if todo is not present', function() {
    const todoList = new TodoList(list);
    const taskAdded = todoList.removeTask(20, 1);
    assert.notOk(taskAdded);
  });
  it('Should not remove task if task is not present', function() {
    const todoList = new TodoList(list);
    const taskAdded = todoList.removeTask(1, 20);
    assert.notOk(taskAdded);
  });
});

describe('renameTodo', function() {
  it('Should rename the title of the given todoId', function() {
    const todoList = new TodoList(list);
    const renamedTodo = todoList.renameTodo('new title', 1);
    assert.ok(renamedTodo);
  });
  it('Should not rename todo if todo is not present', function() {
    const todoList = new TodoList(list);
    const taskAdded = todoList.renameTodo('new task', 20);
    assert.notOk(taskAdded);
  });
});

describe('renameTask', function() {
  it('Should rename the task, given todoId, taskId and new title', function() {
    const todoList = new TodoList(list);
    const renamedTask = todoList.renameTask('new title', 1, 1);
    assert.ok(renamedTask);
  });
  it('Should not rename task if todo is not present', function() {
    const todoList = new TodoList(list);
    const taskAdded = todoList.renameTask('new task', 20, 1);
    assert.notOk(taskAdded);
  });
  it('Should not rename task if task is not present', function() {
    const todoList = new TodoList(list);
    const taskAdded = todoList.renameTask('new task', 1, 20);
    assert.notOk(taskAdded);
  });
});

describe('changeStatus', function() {
  it('Should add the new task to the given todoId', function() {
    const todoList = new TodoList(list);
    const changedStatus = todoList.changeStatus(1, 1);
    assert.ok(changedStatus);
  });
  it('Should not change status of task if todo is not present', function() {
    const todoList = new TodoList(list);
    const taskAdded = todoList.changeStatus(20, 1);
    assert.notOk(taskAdded);
  });
  it('Should not change status of task if task is not present', function() {
    const todoList = new TodoList(list);
    const taskAdded = todoList.changeStatus(1, 20);
    assert.notOk(taskAdded);
  });
});
