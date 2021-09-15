import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { DragEvent, DragEventHandler, useMemo, useState } from 'react';

const StyledDropZone = styled.div<{ isDropOver: boolean; isValidFiles: boolean }>`
  opacity: 1;
  visibility: initial;
  width: 100%;
  height: 100%;
  padding: 3rem;

  background: rgba(0, 0, 0, 0.15);
  border: 5px solid var(--black);

  ${({ isDropOver, isValidFiles }) =>
    isDropOver
      ? css`
          opacity: 1;
          visibility: initial;
          background: rgba(0, 0, 0, 0.35);

          border-color: ${isValidFiles ? 'var(--green-mid)' : 'var(--error)'};
        `
      : ''}
`;

interface DropZoneProps {
  label: string;
  files: FileList;
  onDrop: (e: DragEvent) => void;
  acceptFileTypes?: string[];
  onDragEnter?: DragEventHandler<HTMLDivElement>;
  onDragLeave?: DragEventHandler<HTMLDivElement>;
}

export const DropZone: React.FC<DropZoneProps> = ({
  label,
  files,
  onDrop,
  acceptFileTypes,
  onDragEnter,
  onDragLeave,
}: DropZoneProps) => {
  const [isDropOver, setIsDropOver] = useState(false);
  const [isValidFiles, setIsValidFiles] = useState(true);

  const hasFileRestrictions = useMemo(() => typeof acceptFileTypes === 'object', [acceptFileTypes]);

  return (
    <StyledDropZone
      isDropOver={isDropOver}
      isValidFiles={isValidFiles}
      onDragEnter={(e) => {
        e.preventDefault();
        setIsDropOver(true);

        const files = e.dataTransfer.files;

        const fileTypesOverlap =
          !hasFileRestrictions ||
          [...files].reduce<boolean>((overlaps, file) => {
            if (overlaps === false) {
              return false;
            }

            return acceptFileTypes.includes(file.type);
          }, true);

        if (hasFileRestrictions) {
          setIsValidFiles(fileTypesOverlap);
        }

        if (onDragEnter) {
          onDragEnter(e);
        }
      }}
      onDragOver={(e) => {
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

        if (onDrop) {
          onDrop(e);
        }
      }}
    >
      <div>{label}</div>
      {files && (
        <div>
          {[...files].map((file, index) => (
            <div key={index}>{file.type}</div>
          ))}
        </div>
      )}
    </StyledDropZone>
  );
};
