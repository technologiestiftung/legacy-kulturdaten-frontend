import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { DragEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import { useT } from '../../lib/i18n';

const StyledDropZone = styled.div``;

const hoverShadow = '0px 0px 0px 0.25rem var(--grey-400)';
const validShadow = '0px 0px 0px 0.25rem var(--green-light)';
const errorShadow = '0px 0px 0px 0.25rem var(--error-light)';

const StyledDropZoneLabel = styled.label<{
  isDropOver: boolean;
  isValidFiles: boolean;
  isUploading?: boolean;
}>`
  display: block;
  opacity: 1;
  visibility: initial;
  width: 100%;
  height: 100%;
  padding: 2.25rem;

  border-radius: 0.75rem;
  transition: box-shadow var(--transition-duration-fast),
    border-color var(--transition-duration-fast);
  background: var(--grey-200);
  border: 1px solid var(--grey-400);
  position: relative;
  overflow: hidden;

  ${({ isUploading, isDropOver, isValidFiles }) =>
    !isUploading
      ? css`
          cursor: pointer;
          &:hover {
            box-shadow: ${hoverShadow};
            border-color: var(--grey-600);
          }

          ${isDropOver
            ? css`
                opacity: 1;
                visibility: initial;
                box-shadow: ${isValidFiles ? validShadow : errorShadow};

                border-color: ${isValidFiles ? 'var(--green-mid)' : 'var(--error)'};
              `
            : ''}
        `
      : css`
          border-color: var(--green-mid);
        `}
`;

const StlyedDropZoneSuccess = styled.div`
  padding: 0.75rem 0 0;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
`;

const dropZoneLabelTextStyles = (isUploading?: boolean) => css`
  transition: opacity var(--transition-duration-fast);

  ${isUploading &&
  css`
    opacity: 0;
  `}
`;

const StyledDropZoneLabelText = styled.div<{ isUploading?: boolean }>`
  font-size: var(--font-size-500);
  line-height: var(--line-height-500);
  font-weight: 700;
  transition: opacity var(--transition-duration-fast);

  ${({ isUploading }) => dropZoneLabelTextStyles(isUploading)}
`;

const StyledDropZoneLabelSubText = styled.div<{ isUploading?: boolean }>`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  transition: opacity var(--transition-duration-fast);

  ${({ isUploading }) => dropZoneLabelTextStyles(isUploading)}
`;

const StyledDropZoneMessage = styled.div<{
  isDropOver: boolean;
  isValidFiles: boolean;
  isUploading?: boolean;
}>`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  transition: opacity var(--transition-duration-fast);
  opacity: ${({ isUploading, isDropOver }) => (isUploading || isDropOver ? '1' : '0')};

  padding: 2.25rem;
  font-size: var(--font-size-500);
  line-height: var(--line-height-500);
  font-weight: 700;
  display: flex;
  align-items: center;
`;

const StyledDropZoneMessageText = styled.div`
  position: relative;
`;

const StyledDropZoneMessageBackground = styled.div<{
  isValidFiles: boolean;
  isUploading?: boolean;
  progress?: number;
}>`
  position: absolute;
  transition: width var(--transition-duration-fast);
  height: 100%;
  top: 0;
  left: 0;
  width: ${({ isUploading, progress }) => (isUploading ? `${progress * 100}%` : '100%')};
  background: ${({ isUploading, isValidFiles }) =>
    isUploading ? 'rgb(0,255,0,0.2)' : isValidFiles ? 'rgb(0,255,0,0.1)' : 'rgba(255,0,0,0.1)'};
`;

const StyledDropZoneInput = styled.input`
  display: none;
  visibility: hidden;
`;

interface DropZoneProps {
  label: string;
  files: FileList;
  onDrop: (files: FileList) => void;
  isUploading?: boolean;
  progress?: number;
  success?: {
    count: number;
  };
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
  isUploading,
  progress,
  onDragLeave,
  success,
}: DropZoneProps) => {
  // const isUploading = true;
  // const progress = 0.75;

  const t = useT();
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
        isUploading={isUploading}
        onDragEnter={(e) => {
          e.preventDefault();

          if (!isUploading) {
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
          }
        }}
        onDragOver={(e) => {
          if (!isUploading) {
            e.preventDefault();
          }

          setIsDropOver(true);
        }}
        onDragLeave={(e) => {
          if (onDragLeave) {
            onDragLeave(e);
          }

          setIsDropOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();

          if (!isUploading) {
            setIsDropOver(false);

            if (isValidFiles) {
              onDrop(e.dataTransfer.files);
            }
          }
        }}
      >
        <StyledDropZoneLabelText isUploading={isUploading}>{label}</StyledDropZoneLabelText>
        {acceptedFileTypes && (
          <StyledDropZoneLabelSubText isUploading={isUploading}>
            {t('dropZone.allowedFileTypes')}: {acceptedFileTypes.map(({ name }) => name).join(', ')}
          </StyledDropZoneLabelSubText>
        )}
        <StyledDropZoneInput
          type="file"
          ref={inputRef}
          multiple
          accept={acceptedFileTypes?.join(',')}
          disabled={isUploading}
        />
        <StyledDropZoneMessage
          isUploading={isUploading}
          isDropOver={isDropOver}
          isValidFiles={isValidFiles}
        >
          <StyledDropZoneMessageBackground
            isUploading={isUploading}
            isValidFiles={isValidFiles}
            progress={progress}
          />
          {isUploading && (
            <StyledDropZoneMessageText>
              {t('dropZone.uploading', { progress: `${Math.ceil(progress * 100)}%` })}
            </StyledDropZoneMessageText>
          )}
        </StyledDropZoneMessage>
      </StyledDropZoneLabel>
      {success && (
        <StlyedDropZoneSuccess>
          {t('dropZone.success', { count: success.count })}
        </StlyedDropZoneSuccess>
      )}
    </StyledDropZone>
  );
};
