import { render, RenderOptions } from '@testing-library/react';
import { UserContextProvider } from '../components/user/UserContext';
import { WindowContextProvider } from '../lib/WindowService';
import { NavigationContextProvider } from '../components/navigation/NavigationContext';

const AllTheProviders: React.FC = ({ children }: { children: React.ReactNode }) => {
  return (
    <WindowContextProvider>
      <NavigationContextProvider>
        <UserContextProvider>{children} </UserContextProvider>
      </NavigationContextProvider>
    </WindowContextProvider>
  );
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'queries'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';

export { customRender as render };
