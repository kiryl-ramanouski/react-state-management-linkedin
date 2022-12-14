import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import BookItem from './BookItem';
import TodoTextInput from './TodoTextInput';

const setup = (editing = false) => {
  const props = {
    todo: {
      id: 0,
      text: 'Use Redux',
      completed: false,
    },
    editBook: jest.fn(),
    deleteBook: jest.fn(),
    completeBook: jest.fn(),
  };

  const renderer = createRenderer();

  renderer.render(<BookItem {...props} />);

  let output = renderer.getRenderOutput();

  if (editing) {
    const label = output.props.children.props.children[1];
    label.props.onDoubleClick({});
    output = renderer.getRenderOutput();
  }

  return {
    props: props,
    output: output,
    renderer: renderer,
  };
};

describe('components', () => {
  describe('BookItem', () => {
    it('initial render', () => {
      const { output } = setup();

      expect(output.type).toBe('li');
      expect(output.props.className).toBe('');

      const div = output.props.children;

      expect(div.type).toBe('div');
      expect(div.props.className).toBe('view');

      const [input, label, button] = div.props.children;

      expect(input.type).toBe('input');
      expect(input.props.checked).toBe(false);

      expect(label.type).toBe('label');
      expect(label.props.children).toBe('Use Redux');

      expect(button.type).toBe('button');
      expect(button.props.className).toBe('destroy');
    });

    it('input onChange should call completeBook', () => {
      const { output, props } = setup();
      const input = output.props.children.props.children[0];
      input.props.onChange({});
      expect(props.completeBook).toBeCalledWith(0);
    });

    it('button onClick should call deleteBook', () => {
      const { output, props } = setup();
      const button = output.props.children.props.children[2];
      button.props.onClick({});
      expect(props.deleteBook).toBeCalledWith(0);
    });

    it('label onDoubleClick should put component in edit state', () => {
      const { output, renderer } = setup();
      const label = output.props.children.props.children[1];
      label.props.onDoubleClick({});
      const updated = renderer.getRenderOutput();
      expect(updated.type).toBe('li');
      expect(updated.props.className).toBe('editing');
    });

    it('edit state render', () => {
      const { output } = setup(true);

      expect(output.type).toBe('li');
      expect(output.props.className).toBe('editing');

      const input = output.props.children;
      expect(input.type).toBe(TodoTextInput);
      expect(input.props.text).toBe('Use Redux');
      expect(input.props.editing).toBe(true);
    });

    it('TodoTextInput onSave should call editBook', () => {
      const { output, props } = setup(true);
      output.props.children.props.onSave('Use Redux');
      expect(props.editBook).toBeCalledWith(0, 'Use Redux');
    });

    it('TodoTextInput onSave should call deleteBook if text is empty', () => {
      const { output, props } = setup(true);
      output.props.children.props.onSave('');
      expect(props.deleteBook).toBeCalledWith(0);
    });

    it('TodoTextInput onSave should exit component from edit state', () => {
      const { output, renderer } = setup(true);
      output.props.children.props.onSave('Use Redux');
      const updated = renderer.getRenderOutput();
      expect(updated.type).toBe('li');
      expect(updated.props.className).toBe('');
    });
  });
});
