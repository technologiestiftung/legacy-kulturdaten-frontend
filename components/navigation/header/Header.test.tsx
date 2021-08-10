import { render } from '../../../lib/test-utils';
import { WrappedUser } from '../../user/useUser';
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
      user={{ isLoggedIn: false } as WrappedUser}
    />
  );
  expect(container).toMatchSnapshot();
});
