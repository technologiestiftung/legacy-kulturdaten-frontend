import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import { useKeyboard } from '../../lib/useKeyboard';
import { ConfirmScreen } from './ConfirmScreen';

type ConfirmContext = {
  confirmScreen: {
    render: boolean;
    setRender: (visible: boolean) => void;
    visible: boolean;
    setVisible: (visible: boolean) => void;
    confirmText: string;
    setConfirmText: (confirmText: string) => void;
    condition: {
      label: string;
      value: string;
    };
    setCondition: (condition: { label: string; value: string }) => void;
    onConfirm: () => Promise<void>;
    setOnConfirm: (onConfirm: () => Promise<void>) => void;
    title: React.ReactNode | string;
    setTitle: (message: React.ReactNode | string) => void;
    message: React.ReactNode | string;
    setMessage: (message: React.ReactNode | string) => void;
  };
};

export const ConfirmContext = React.createContext<ConfirmContext>({
  confirmScreen: {
    render: false,
    setRender: () => undefined,
    visible: false,
    setVisible: () => undefined,
    confirmText: undefined,
    setConfirmText: () => undefined,
    onConfirm: () => undefined,
    setOnConfirm: () => undefined,
    condition: undefined,
    setCondition: () => undefined,
    title: undefined,
    setTitle: () => undefined,
    message: undefined,
    setMessage: () => undefined,
  },
});

interface ConfirmContextProviderProps {
  children: ReactNode;
}

export const ConfirmContextProvider: React.FC<ConfirmContextProviderProps> = ({
  children,
}: ConfirmContextProviderProps) => {
  const [render, setRender] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [confirmText, setConfirmText] = useState<string>();
  const [onConfirm, setOnConfirm] = useState<() => Promise<void>>();
  const [title, setTitle] = useState<React.ReactNode | string>('');
  const [message, setMessage] = useState<React.ReactNode | string>('');
  const router = useRouter();
  const [condition, setCondition] = useState<{
    label: string;
    value: string;
  }>();

  useKeyboard(() => {
    if (render && visible) {
      setVisible(false);
      setRender(false);
      setOnConfirm(undefined);
    }
  }, ['Escape']);

  useEffect(() => {
    const handleRouteChange = () => {
      setVisible(false);
      setRender(false);
      setOnConfirm(undefined);
    };

    router?.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router?.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router?.events]);

  return (
    <ConfirmContext.Provider
      value={{
        confirmScreen: {
          render,
          setRender,
          visible,
          setVisible,
          confirmText,
          setConfirmText,
          onConfirm,
          setOnConfirm,
          title,
          setTitle,
          message,
          setMessage,
          condition,
          setCondition,
        },
      }}
    >
      {children}
      {render && (
        <ConfirmScreen
          visible={visible}
          message={message}
          onConfirm={async () => {
            console.log('ejo');
            if (typeof onConfirm === 'function') {
              await onConfirm();
            }

            setVisible(false);
            setRender(false);
            setOnConfirm(undefined);
          }}
          onCancel={() => {
            setVisible(false);
            setRender(false);
            setOnConfirm(undefined);
          }}
          title={title}
          confirmText={confirmText}
          condition={condition}
        />
      )}
    </ConfirmContext.Provider>
  );
};
