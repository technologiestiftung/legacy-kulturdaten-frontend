import { render } from '../../../lib/test-utils';
import { MenuItemType } from '../Menu';
import { HeaderMain } from './Header';
import { HeaderLink } from './HeaderLink';

test('Header renders', () => {
  const { container } = render(
    <HeaderMain
      title="Test title"
      Link={HeaderLink}
      menuItems={[
        { type: MenuItemType.link, action: { href: '#', title: 'Test' } },
        { type: MenuItemType.divider },
      ]}
      user={undefined}
      userIsLoggedIn={false}
    />
  );
  expect(container).toMatchSnapshot();
});
