import { useEffect } from 'react';

export const PreventDrop: React.FC = () => {
  useEffect(() => {
    const dropHandler = (e: globalThis.DragEvent) => {
      e.preventDefault();
    };

    document.body.addEventListener('drop', dropHandler);
    document.body.addEventListener('dragenter', dropHandler);
    document.body.addEventListener('dragover', dropHandler);

    return () => {
      document.body.removeEventListener('drop', dropHandler);
      document.body.removeEventListener('dragenter', dropHandler);
      document.body.removeEventListener('dragover', dropHandler);
    };
  }, []);

  return null;
};
