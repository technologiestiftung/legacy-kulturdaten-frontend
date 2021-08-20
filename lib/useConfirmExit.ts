import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { useLocale } from './routing';
import { WindowContext } from './WindowService';

export const useConfirmExit = (
  shouldWarn: boolean,
  message: string,
  onAbort?: () => void
): void => {
  const locale = useLocale();
  const router = useRouter();
  const { rendered } = useContext(WindowContext);

  useEffect(() => {
    let warned = false;

    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (!warned && shouldWarn) {
        const event = e || window.event;
        event.returnValue = message;
        return message;
      }

      return null;
    };

    window.addEventListener('beforeunload', beforeUnload);

    const routeChangeHandler = (url: string) => {
      if (rendered && `/${locale}${router.asPath}` !== url && shouldWarn && !warned) {
        warned = true;

        if (window.confirm(message)) {
          if (typeof onAbort === 'function') {
            onAbort();
          }

          return;
        } else {
          warned = false;
          router.events.emit('routeChangeError');
          router.replace(router, router.asPath, { shallow: true });
          throw 'routeChange aborted.';
        }
      }
    };

    router.events.on('routeChangeStart', routeChangeHandler);

    router.beforePopState(({ url }) => {
      if (`/${locale}${router.asPath}` !== url && shouldWarn && !warned) {
        warned = true;
        if (window.confirm(message)) {
          if (typeof onAbort === 'function') {
            onAbort();
          }

          return true;
        } else {
          warned = false;
          window.history.pushState(null, '', url);
          router.replace(router, router.asPath, { shallow: true });
          return false;
        }
      }

      return true;
    });

    return () => {
      router.events.off('routeChangeStart', routeChangeHandler);
      window.removeEventListener('beforeunload', beforeUnload);

      router.beforePopState(() => {
        return true;
      });
    };
  }, [rendered, locale, message, onAbort, router, shouldWarn]);
};
