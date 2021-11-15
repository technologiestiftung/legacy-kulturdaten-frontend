import { render, RenderOptions } from '@testing-library/react';
import { WindowContextProvider } from '../lib/WindowService';

const AllTheProviders: React.FC = ({ children }: { children: React.ReactNode }) => {
  return <WindowContextProvider>{children}</WindowContextProvider>;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'queries'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';

export { customRender as render };
