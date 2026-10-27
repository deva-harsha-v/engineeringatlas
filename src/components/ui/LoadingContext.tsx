'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { FullScreenRippleLoader } from './RippleLoader';

interface LoadingContextType {
  isLoading: boolean;
  message?: string;
  subMessage?: string;
  showLoader: (message?: string, subMessage?: string) => void;
  hideLoader: () => void;
  withLoading: <T>(action: () => Promise<T>, message?: string, subMessage?: string) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>('Loading...');
  const [subMessage, setSubMessage] = useState<string | undefined>('Engineering Atlas');

  const showLoader = useCallback((msg?: string, sub?: string) => {
    setMessage(msg || 'Processing...');
    setSubMessage(sub || 'Engineering Atlas');
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
  }, []);

  const withLoading = useCallback(
    async <T,>(action: () => Promise<T>, msg?: string, sub?: string): Promise<T> => {
      showLoader(msg, sub);
      try {
        return await action();
      } finally {
        hideLoader();
      }
    },
    [showLoader, hideLoader]
  );

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        message,
        subMessage,
        showLoader,
        hideLoader,
        withLoading,
      }}
    >
      {children}
      <FullScreenRippleLoader isVisible={isLoading} message={message} subMessage={subMessage} />
    </LoadingContext.Provider>
  );
}

export function useGlobalLoading(): LoadingContextType {
  const context = useContext(LoadingContext);
  if (!context) {
    return {
      isLoading: false,
      showLoader: () => {},
      hideLoader: () => {},
      withLoading: async <T,>(fn: () => Promise<T>) => fn(),
    };
  }
  return context;
}
