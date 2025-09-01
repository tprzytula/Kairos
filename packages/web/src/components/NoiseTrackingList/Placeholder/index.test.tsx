import { render, screen } from '@testing-library/react';
import Placeholder from '.';

describe('Given the Placeholder component', () => {
  describe('When rendering with default props', () => {
    it('should display the noise tracking placeholders container', () => {
      render(<Placeholder />);

      expect(screen.getByLabelText('Loading noise tracking items')).toBeInTheDocument();
    });

    it('should render the default number of placeholder groups', () => {
      render(<Placeholder />);

      expect(screen.getAllByLabelText('Noise tracking item placeholder')).toHaveLength(9);
    });

    it('should render the container with proper structure', () => {
      const { container } = render(<Placeholder />);

      const containerDiv = container.firstChild;
      expect(containerDiv).toBeInTheDocument();
    });


  });

  describe('When rendering with custom numberOfGroups', () => {
    it('should render the specified number of groups', () => {
      render(<Placeholder numberOfGroups={2} />);

      expect(screen.getAllByLabelText('Noise tracking item placeholder')).toHaveLength(5);
    });

    it('should still display the placeholders container', () => {
      render(<Placeholder numberOfGroups={2} />);

      expect(screen.getByLabelText('Loading noise tracking items')).toBeInTheDocument();
    });
  });

  describe('When rendering with zero groups', () => {
    it('should render without errors', () => {
      render(<Placeholder numberOfGroups={0} />);

      expect(screen.getByLabelText('Loading noise tracking items')).toBeInTheDocument();
      expect(screen.queryAllByLabelText('Noise tracking item placeholder')).toHaveLength(0);
    });
  });
});
