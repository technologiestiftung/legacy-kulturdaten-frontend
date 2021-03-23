import renderer from 'react-test-renderer';

import { Test } from '.';

test('Test renders', () => {
  const component = renderer.create(<Test />);
  const tree = component.toJSON();

  expect(tree).toMatchSnapshot();
});
