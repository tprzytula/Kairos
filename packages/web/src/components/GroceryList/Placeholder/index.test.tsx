import { render, screen } from '@testing-library/react';
import Placeholder from '.';

describe('Given the Placeholder component', () => {
  describe('When rendering with default props', () => {
    it('should display the grocery placeholders container', () => {
      render(<Placeholder />);

      expect(screen.getByLabelText('Loading grocery items')).toBeInTheDocument();
    });

    it('should render the default number of placeholder groups', () => {
      render(<Placeholder />);

      expect(screen.getAllByLabelText('Grocery item placeholder')).toHaveLength(20);
    });

    it('should render the container with proper structure', () => {
      const { container } = render(<Placeholder />);

      const containerDiv = container.firstChild;
      expect(containerDiv).toBeInTheDocument();
    });
  });

  describe('When rendering with custom numberOfGroups', () => {
    it('should render the specified number of groups', () => {
      render(<Placeholder numberOfGroups={3} />);

      expect(screen.getAllByLabelText('Grocery item placeholder')).toHaveLength(9);
    });

    it('should still display the placeholders container', () => {
      render(<Placeholder numberOfGroups={2} />);

      expect(screen.getByLabelText('Loading grocery items')).toBeInTheDocument();
    });
  });

  describe('When rendering with zero groups', () => {
    it('should render without errors', () => {
      render(<Placeholder numberOfGroups={0} />);

      expect(screen.getByLabelText('Loading grocery items')).toBeInTheDocument();
      expect(screen.queryAllByLabelText('Grocery item placeholder')).toHaveLength(0);
    });
  });
});
