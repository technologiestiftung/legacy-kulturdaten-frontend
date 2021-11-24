import React, { ReactNode, useState } from 'react';
import { ConfirmScreen } from './ConfirmScreen';

type ConfirmContext = {
  confirmScreen: {
    render: boolean;
    setRender: (visible: boolean) => void;
    visible: boolean;
    setVisible: (visible: boolean) => void;
    confirmText: string;
    setConfirmText: (confirmText: string) => void;
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
        />
      )}
    </ConfirmContext.Provider>
  );
};
