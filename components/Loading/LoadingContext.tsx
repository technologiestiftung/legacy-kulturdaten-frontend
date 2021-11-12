import React, { ReactNode, useState } from 'react';
import { LoadingScreen } from './LoadingScreen';

type LoadingContext = {
  loadingScreen: {
    render: boolean;
    setRender: (visible: boolean) => void;
    visible: boolean;
    setVisible: (visible: boolean) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    title: React.ReactNode | string;
    setTitle: (message: React.ReactNode | string) => void;
    message: React.ReactNode | string;
    setMessage: (message: React.ReactNode | string) => void;
    error: React.ReactNode | string;
    setError: (error: React.ReactNode | string) => void;
  };
};

export const LoadingContext = React.createContext<LoadingContext>({
  loadingScreen: {
    render: false,
    setRender: () => undefined,
    visible: false,
    setVisible: () => undefined,
    loading: false,
    setLoading: () => undefined,
    title: undefined,
    setTitle: () => undefined,
    message: undefined,
    setMessage: () => undefined,
    error: undefined,
    setError: () => undefined,
  },
});

interface LoadingContextProviderProps {
  children: ReactNode;
}

export const LoadingContextProvider: React.FC<LoadingContextProviderProps> = ({
  children,
}: LoadingContextProviderProps) => {
  const [render, setRender] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<React.ReactNode | string>('');
  const [message, setMessage] = useState<React.ReactNode | string>('');
  const [error, setError] = useState<React.ReactNode | string>();

  return (
    <LoadingContext.Provider
      value={{
        loadingScreen: {
          render,
          setRender,
          visible,
          setVisible,
          loading,
          setLoading,
          title,
          setTitle,
          message,
          setMessage,
          error,
          setError,
        },
      }}
    >
      {children}
      {render && (
        <LoadingScreen
          visible={visible}
          message={message}
          error={error}
          loading={loading}
          title={title}
        />
      )}
    </LoadingContext.Provider>
  );
};
