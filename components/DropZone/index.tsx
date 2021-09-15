import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { DragEventHandler, useEffect, useMemo, useRef, useState } from 'react';

const StyledDropZone = styled.div``;

const hoverShadow = '0px 0px 0px 0.25rem var(--grey-400)';
const validShadow = '0px 0px 0px 0.25rem var(--green-light)';
const errorShadow = '0px 0px 0px 0.25rem var(--error-light)';

const StyledDropZoneLabel = styled.label<{ isDropOver: boolean; isValidFiles: boolean }>`
  display: block;
  opacity: 1;
  visibility: initial;
  width: 100%;
  height: 100%;
  padding: 3rem;
  cursor: pointer;
  border-radius: 0.75rem;
  transition: box-shadow var(--transition-duration), border-color var(--transition-duration);
  background: var(--grey-200);
  border: 1px solid var(--grey-400);
  position: relative;
  overflow: hidden;

  &:hover {
    box-shadow: ${hoverShadow};
    border-color: var(--grey-600);
  }

  ${({ isDropOver, isValidFiles }) =>
    isDropOver
      ? css`
          opacity: 1;
          visibility: initial;
          box-shadow: ${isValidFiles ? validShadow : errorShadow};

          border-color: ${isValidFiles ? 'var(--green-mid)' : 'var(--error)'};
        `
      : ''}
`;

const StyledDropZoneMessage = styled.div<{ isDropOver: boolean; isValidFiles: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  transition: opacity var(--transition-duration);
  opacity: ${({ isDropOver }) => (isDropOver ? '1' : '0')};
  background: ${({ isValidFiles }) => (isValidFiles ? 'rgb(0,255,0,0.1)' : 'rgba(255,0,0,0.1)')};
`;

const StyledDropZoneInput = styled.input`
  display: none;
  visibility: hidden;
`;

interface DropZoneProps {
  label: string;
  files: FileList;
  onDrop: (files: FileList) => void;
  acceptedFileTypes?: { mimeType: string; name: string }[];
  acceptedFileTypesHumanReadable?: string[];
  onDragEnter?: DragEventHandler<HTMLLabelElement>;
  onDragLeave?: DragEventHandler<HTMLLabelElement>;
}

export const DropZone: React.FC<DropZoneProps> = ({
  label,
  files,
  onDrop,
  acceptedFileTypes,
  onDragEnter,
  onDragLeave,
}: DropZoneProps) => {
  const [isDropOver, setIsDropOver] = useState(false);
  const [isValidFiles, setIsValidFiles] = useState(true);
  const hasFileRestrictions = useMemo(
    () => typeof acceptedFileTypes === 'object',
    [acceptedFileTypes]
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const current = inputRef.current;

    const inputChangeHandler = () => {
      console.log(current?.files);
      onDrop(undefined);
      onDrop(current?.files);
    };

    current?.addEventListener('change', inputChangeHandler);

    return () => {
      current?.removeEventListener('change', inputChangeHandler);
    };
  }, [onDrop]);

  return (
    <StyledDropZone>
      <StyledDropZoneLabel
        isDropOver={isDropOver}
        isValidFiles={isValidFiles}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDropOver(true);

          const fileItems = e.dataTransfer.items;

          const fileTypesOverlap =
            !hasFileRestrictions ||
            [...fileItems].reduce<boolean>((overlaps, fileItem) => {
              if (overlaps === false) {
                return false;
              }

              return acceptedFileTypes.map(({ mimeType }) => mimeType).includes(fileItem.type);
            }, true);

          if (hasFileRestrictions) {
            setIsValidFiles(fileTypesOverlap);
          }

          if (onDragEnter) {
            onDragEnter(e);
          }
        }}
        onDragOver={(e) => {
          setIsDropOver(true);
          e.preventDefault();
        }}
        onDragLeave={(e) => {
          setIsDropOver(false);

          if (onDragLeave) {
            onDragLeave(e);
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDropOver(false);

          if (isValidFiles) {
            onDrop(e.dataTransfer.files);
          }
        }}
      >
        <div>{label}</div>
        {acceptedFileTypes && (
          <div>Erlaubte Dateitypen: {acceptedFileTypes.map(({ name }) => name).join(', ')}</div>
        )}
        <StyledDropZoneInput
          type="file"
          ref={inputRef}
          multiple
          accept={acceptedFileTypes?.join(',')}
        />
        {files && (
          <div>
            {[...files].map((file, index) => (
              <div key={index}>{file.type}</div>
            ))}
          </div>
        )}
        <StyledDropZoneMessage
          isDropOver={isDropOver}
          isValidFiles={isValidFiles}
        ></StyledDropZoneMessage>
      </StyledDropZoneLabel>
    </StyledDropZone>
  );
};
