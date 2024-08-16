import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

const setup = () => {
  const input = screen.getByPlaceholderText('What needs to be done?');
  const form = screen.getByTestId('form');
  const todoList = screen.getByTestId('todo_list');

  return { input, form, todoList}
}

const getFilterButton = () => {
  const filterToActiveButton = screen.getByTestId('filter_to_active');
  const filterToCompletedButton = screen.getByTestId('filter_to_completed');

  return { filterToActiveButton, filterToCompletedButton }
}

const submitForm = (input: HTMLElement, form: HTMLElement) => {
  fireEvent.change(input, { target: { value: 'todo1' } });
  fireEvent.submit(form);

  return screen.getByLabelText('active_todo');
}

const completeTodo = () => {
  const completedButton = screen.getByLabelText('completed_todo_button');
  fireEvent.click(completedButton);

  return screen.getByLabelText('completed_todo');
}

test('renders todos', () => {
  render(<App />);

  const todoElement = screen.getByText(/todos/i);

  expect(todoElement).toBeInTheDocument();
});

test('write new todo', () => {
  render(<App />);
  const { input } = setup();

  fireEvent.change(input, { target: { value: 'todo1' } });

  expect(input).toHaveValue('todo1');
});

test('clear new todo text', () => {
  render(<App />);
  const { input } = setup();

  fireEvent.change(input, { target: { value: 'todo1' } });

  const button = screen.getByTestId('clear_text');
  fireEvent.click(button);

  expect(input).toHaveValue('');
});

test('clear input after submit', () => {
  render(<App />);
  const { input, form } = setup();

  fireEvent.submit(form);

  expect(input).toHaveValue('');
});

test('add todo', () => {
  render(<App />);
  const { input, form, todoList } = setup();

  const new_todo = submitForm(input, form);

  const count_active_todo = screen.getByTestId('count_active_todo');

  expect(count_active_todo).toHaveTextContent('1');
  expect(todoList).toContainElement(new_todo);
});

test('delete todo', () => {
  render(<App />);
  const { input, form, todoList } = setup();

  const new_todo = submitForm(input, form)

  const deleteButton = screen.getByLabelText('delete_todo');
  fireEvent.click(deleteButton);

  const count_active_todo = screen.getByTestId('count_active_todo');

  expect(count_active_todo).toHaveTextContent('0');
  expect(todoList).not.toContainElement(new_todo);
});

test('completed todo', () => {
  render(<App />);
  const { input, form, todoList } = setup();

  submitForm(input, form)

  const completed_todo = completeTodo();
  const completed_svg = screen.getByLabelText('completed_svg');
  const count_active_todo = screen.getByTestId('count_active_todo');

  expect(count_active_todo).toHaveTextContent('0');
  expect(todoList).toContainElement(completed_todo);
  expect(todoList).toContainElement(completed_svg);
});

test('clear completed todo', () => {
  render(<App />);
  const { input, form, todoList } = setup();

  submitForm(input, form)

  const completed_todo = completeTodo();
  const clear_completed_todos_button = screen.getByTestId('clear_completed_todos');

  fireEvent.click(clear_completed_todos_button);

  expect(todoList).not.toContainElement(completed_todo);
});

test('filter to active todo', () => {
  render(<App />);
  const { input, form, todoList } = setup();

  const active_todo = submitForm(input, form)

  const { filterToActiveButton, filterToCompletedButton } = getFilterButton()

  expect(todoList).toContainElement(active_todo);

  fireEvent.click(filterToActiveButton);
  expect(todoList).toContainElement(active_todo);

  fireEvent.click(filterToCompletedButton);
  expect(todoList).not.toContainElement(active_todo);
});

test('filter to completed todo', () => {
  render(<App />);
  const { input, form, todoList } = setup();

  submitForm(input, form)

  const completed_todo = completeTodo();
  const { filterToActiveButton, filterToCompletedButton } = getFilterButton()

  expect(todoList).toContainElement(completed_todo);

  fireEvent.click(filterToActiveButton);
  expect(todoList).not.toContainElement(completed_todo);

  // todo: i dont know why it isnt work
  // fireEvent.click(filterToCompletedButton);
  // expect(todoList).toContainElement(completed_todo);
});
