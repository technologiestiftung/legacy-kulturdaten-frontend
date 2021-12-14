import React, { ReactNode, Reducer, useMemo, useReducer, useState } from 'react';
import { DownloadToast, DownloadToastWrapper } from './';

enum DownloadsActions {
  add = 'add',
  update = 'update',
  remove = 'remove',
}

type Download = {
  id: number;
  fileName: string;
  progress: number;
  fadeOut?: boolean;
};

type DownloadsState = Download[];

type DownloadsAction = {
  type: DownloadsActions;
  payload: Download;
};

const downloadsReducer: Reducer<DownloadsState, DownloadsAction> = (state, action) => {
  switch (action.type) {
    case DownloadsActions.add: {
      return [...state, action.payload];
    }

    case DownloadsActions.update: {
      const indexOfDownload = state.findIndex(({ id }) => id === action.payload.id);

      return [
        ...state.slice(0, indexOfDownload),
        action.payload,
        ...state.slice(indexOfDownload + 1),
      ];
    }

    case DownloadsActions.remove: {
      return state.filter(({ id }) => id !== action.payload.id);
    }

    default: {
      break;
    }
  }
};

type DownloadContext = {
  downloads: DownloadsState;
  add: (download: Download) => void;
  update: (download: Download) => void;
  remove: (download: Download) => void;
  getNewId: () => number;
};

export const DownloadContext = React.createContext<DownloadContext>({
  downloads: [],
  add: () => undefined,
  update: () => undefined,
  remove: () => undefined,
  getNewId: () => undefined,
});

interface DownloadContextProviderProps {
  children: ReactNode;
}

export const DownloadContextProvider: React.FC<DownloadContextProviderProps> = ({
  children,
}: DownloadContextProviderProps) => {
  const [nextId, setNextId] = useState(0);
  const [downloads, dispatchDownloads] = useReducer(downloadsReducer, []);
  const render = useMemo(() => downloads?.length > 0, [downloads?.length]);

  return (
    <DownloadContext.Provider
      value={{
        downloads,
        add: (download) => dispatchDownloads({ type: DownloadsActions.add, payload: download }),
        update: (download) =>
          dispatchDownloads({ type: DownloadsActions.update, payload: download }),
        remove: (download) => {
          dispatchDownloads({
            type: DownloadsActions.update,
            payload: { ...download, fadeOut: true },
          });
          setTimeout(
            () => dispatchDownloads({ type: DownloadsActions.remove, payload: download }),
            500
          );
        },
        getNewId: () => {
          const newId = nextId;
          setNextId(newId + 1);

          return newId;
        },
      }}
    >
      {children}
      {render && (
        <DownloadToastWrapper>
          {downloads.map((download, index) => (
            <DownloadToast
              key={index}
              fileName={download.fileName}
              progress={download.progress}
              fadeOut={download.fadeOut}
            />
          ))}
        </DownloadToastWrapper>
      )}
    </DownloadContext.Provider>
  );
};
