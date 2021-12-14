import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import { useKeyboard } from '../../lib/useKeyboard';
import { ConfirmCondition, ConfirmScreen } from './ConfirmScreen';

type ConfirmContext = {
  confirmScreen: {
    render: boolean;
    setRender: (visible: boolean) => void;
    visible: boolean;
    setVisible: (visible: boolean) => void;
    confirmButtonText: string;
    setConfirmButtonText: (confirmButtonText: string) => void;
    condition: ConfirmCondition;
    setCondition: (condition: ConfirmCondition) => void;
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
    confirmButtonText: undefined,
    setConfirmButtonText: () => undefined,
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
  const [confirmButtonText, setConfirmButtonText] = useState<string>();
  const [onConfirm, setOnConfirm] = useState<() => Promise<void>>();
  const [title, setTitle] = useState<React.ReactNode | string>('');
  const [message, setMessage] = useState<React.ReactNode | string>('');
  const router = useRouter();
  const [condition, setCondition] = useState<ConfirmCondition>();

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
          confirmButtonText,
          setConfirmButtonText,
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
          confirmButtonText={confirmButtonText}
          condition={condition}
        />
      )}
    </ConfirmContext.Provider>
  );
};
