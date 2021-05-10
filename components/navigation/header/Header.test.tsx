import { render } from '../../../lib/test-utils';
import { Header } from './Header';
import { HeaderLink } from './HeaderLink';

test('Header renders', () => {
  const { container } = render(<Header title="Test title" Link={HeaderLink} />);
  expect(container).toMatchSnapshot();
});
