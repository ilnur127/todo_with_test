import React, { FormEvent, useState } from 'react';
import classes from './App.module.scss';
import { ChevronDownIcon, CircleCheckBigIcon, CircleIcon, XIcon } from 'lucide-react';
import { toast } from 'react-toastify';

type TTodo = {
  id: number;
  text: string;
  type: 'active' | 'completed';
};
type TFilterTypes = 'active' | 'completed' | 'all';

const filterButtons: { type: TFilterTypes; text: string }[] = [
  { type: 'all', text: 'All' },
  { type: 'active', text: 'Active' },
  { type: 'completed', text: 'Completed' },
];

function App() {
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [filterType, setFilterType] = useState<TFilterTypes>('all');

  const addNewTodo = (e: FormEvent) => {
    e.preventDefault();
    if (!newTodoText) {
      toast.error('Нет текста задания');
      return;
    }
    setNewTodoText('');
    setTodos((old) => [...old, { id: old.length + 1, text: newTodoText, type: 'active' }]);
    toast.success('Задание успешно добавлено');
  };

  const deleteTodo = (todoId: number) => {
    setTodos((old) => old.filter((old_todo) => old_todo.id !== todoId));
    toast.success('Задание успешно удалено');
  };

  const completedTodo = (todoId: number) => {
    setTodos((old) => old.map((old_todo) => (old_todo.id === todoId ? { ...old_todo, type: 'completed' } : old_todo)));
    toast.success('Задание успешно выполнена');
  };

  return (
    <div className={classes.app}>
      <h1>todos</h1>
      <div>
        <form onSubmit={addNewTodo} data-testid='form'>
          <ChevronDownIcon />
          <input
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder='What needs to be done?'
          />
          <button type='button' data-testid='clear_text' onClick={(e) => setNewTodoText('')}>
            <XIcon />
          </button>
        </form>
        <div className={classes.todosList} data-testid='todo_list'>
          {todos
            .filter((todo) => (filterType !== 'all' ? todo.type === filterType : true))
            .map((todo) => (
              <div
                key={todo.id}
                className={classes.todosList_item}
                aria-label={todo.type === 'active' ? 'active_todo' : 'completed_todo'}
              >
                {todo.type === 'active' ? (
                  <button aria-label='completed_todo_button' onClick={() => completedTodo(todo.id)}>
                    <CircleIcon />
                  </button>
                ) : (
                  <CircleCheckBigIcon color='green' aria-label='completed_svg' />
                )}
                <span className={todo.type === 'completed' ? classes.todosList_item__completed : ''}>{todo.text}</span>
                <button onClick={() => deleteTodo(todo.id)} aria-label='delete_todo'>
                  <XIcon />
                </button>
              </div>
            ))}
        </div>
        <div className={classes.actions}>
          <small>
            <span data-testid='count_active_todo'>{todos.filter((todo) => todo.type === 'active').length}</span> items
            left
          </small>
          <div className={classes.actions_filters}>
            {filterButtons.map((item) => (
              <button
                data-testid={`filter_to_${item.type}`}
                className={item.type === filterType ? classes.active : ''}
                onClick={() => setFilterType(item.type)}
                key={item.type}
              >
                {item.text}
              </button>
            ))}
          </div>
          <button
            data-testid='clear_completed_todos'
            onClick={() => setTodos((old) => old.filter((todo) => todo.type !== 'completed'))}
          >
            Clear completed
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
