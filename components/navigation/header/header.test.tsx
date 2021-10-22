import { render } from '../../../lib/test-utils';

test('Header renders', () => {
  const { container } = render(<div>header test</div>);
  expect(container).toMatchSnapshot();
});
