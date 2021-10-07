import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { DragEventHandler, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useT } from '../../lib/i18n';
import { Info } from '../info';

const StyledDropZone = styled.div``;

const hoverShadow = '0px 0px 0px 0.25rem var(--grey-400)';
const validShadow = '0px 0px 0px 0.25rem var(--green-light)';
const errorShadow = '0px 0px 0px 0.25rem var(--error-light)';

const StyledDropZoneLabel = styled.label<{
  isDropOver: boolean;
  isValidFiles: boolean;
  disabled: boolean;
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

  ${({ disabled, isUploading, isDropOver, isValidFiles }) =>
    !disabled && !isUploading
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
      : !disabled
      ? css`
          border-color: var(--green-mid);
        `
      : ''}
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
  pending?: boolean;
}>`
  position: absolute;
  transition: width var(--transition-duration-fast);
  height: 100%;
  top: 0;
  left: 0;
  width: ${({ isUploading, progress }) => (isUploading ? `${progress * 100}%` : '100%')};
  background: ${({ isUploading, isValidFiles }) =>
    isUploading ? 'rgb(0,255,0,0.2)' : isValidFiles ? 'rgb(0,255,0,0.1)' : 'rgba(255,0,0,0.1)'};

  @keyframes blink {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  ${({ pending }) =>
    pending &&
    css`
      animation-duration: 1s;
      animation-name: blink;
      animation-iteration-count: infinite;
    `}
`;

const StyledDropZoneInput = styled.input`
  display: none;
  visibility: hidden;
`;

interface DropZoneProps {
  label: string;
  onDrop: (files: FileList | File[]) => void;
  isUploading?: boolean;
  progress?: number;
  success?: {
    count: number;
  };
  acceptedFileTypes?: { mimeType: string; name: string }[];
  acceptedFileTypesHumanReadable?: string[];
  onDragEnter?: DragEventHandler<HTMLLabelElement>;
  onDragLeave?: DragEventHandler<HTMLLabelElement>;
  disabled?: boolean;
  disabledMessage?: string;
  max?: number;
  maxFileSizeInKb?: number;
}

export const DropZone: React.FC<DropZoneProps> = ({
  label,
  onDrop,
  acceptedFileTypes,
  onDragEnter,
  isUploading,
  progress,
  onDragLeave,
  success,
  disabled = false,
  disabledMessage,
  max,
  maxFileSizeInKb,
}: DropZoneProps) => {
  const pending = useMemo(() => isUploading && progress === 1, [isUploading, progress]);
  const t = useT();
  const [isDropOver, setIsDropOver] = useState(false);
  const [isValidFiles, setIsValidFiles] = useState(true);
  const [fileSizeValid, setFileSizeValid] = useState(true);
  const [dropFileSize, setDropFileSize] = useState(0);
  const hasFileRestrictions = useMemo(
    () => typeof acceptedFileTypes === 'object',
    [acceptedFileTypes]
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const maxFileSizeString = useMemo(
    () =>
      maxFileSizeInKb
        ? `${Math.floor((maxFileSizeInKb / 1024) * 100) / 100} ${t('media.mb')}`
        : undefined,
    [t, maxFileSizeInKb]
  );

  const dropFileSizeString = useMemo(
    () =>
      dropFileSize
        ? `${Math.floor((dropFileSize / 1024) * 100) / 100} ${t('media.mb')}`
        : undefined,
    [t, dropFileSize]
  );

  const wrappedOnDrop = useCallback(
    (files: FileList | File[]) => {
      const fileSize =
        maxFileSizeInKb && files
          ? [...files].reduce<number>((combinedFileSize, fileItem) => {
              console.log(fileItem);
              return combinedFileSize + fileItem?.size;
            }, 0)
          : undefined;

      setDropFileSize(fileSize ? fileSize / 1024 : undefined);

      const fileSizeValid = fileSize ? fileSize <= maxFileSizeInKb * 1024 : true;

      setFileSizeValid(fileSizeValid);

      if (fileSizeValid && onDrop) {
        onDrop(files);
      }
    },
    [maxFileSizeInKb, onDrop]
  );

  useEffect(() => {
    const current = inputRef.current;

    const inputChangeHandler = () => {
      wrappedOnDrop(undefined);
      wrappedOnDrop(current?.files);
    };

    current?.addEventListener('change', inputChangeHandler);

    return () => {
      current?.removeEventListener('change', inputChangeHandler);
    };
  }, [wrappedOnDrop]);

  return (
    <StyledDropZone>
      <StyledDropZoneLabel
        aria-disabled={disabled}
        aria-valuemax={max}
        aria-dropeffect="execute"
        aria-label={t('dropZone.ariaLabel') as string}
        disabled={disabled}
        isDropOver={isDropOver}
        isValidFiles={isValidFiles}
        isUploading={isUploading}
        onDragEnter={(e) => {
          e.preventDefault();

          if (!disabled && !isUploading) {
            setFileSizeValid(true);
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
          e.preventDefault();

          if (!disabled && !isUploading) {
            setIsDropOver(true);
          }
        }}
        onDragLeave={(e) => {
          if (onDragLeave) {
            onDragLeave(e);
          }

          setIsDropOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();

          if (!disabled && !isUploading) {
            setIsDropOver(false);

            if (isValidFiles) {
              const filesForUpload = max
                ? [...e.dataTransfer.files].slice(0, max)
                : e.dataTransfer.files;
              wrappedOnDrop(filesForUpload);
            }
          }
        }}
      >
        <StyledDropZoneLabelText isUploading={isUploading}>
          {disabled ? disabledMessage : label}
        </StyledDropZoneLabelText>
        {!disabled && acceptedFileTypes && (
          <StyledDropZoneLabelSubText isUploading={isUploading}>
            {t('dropZone.allowedFileTypes')}: {acceptedFileTypes.map(({ name }) => name).join(', ')}
          </StyledDropZoneLabelSubText>
        )}
        {!disabled && maxFileSizeInKb && (
          <StyledDropZoneLabelSubText isUploading={isUploading}>
            {t('dropZone.maxFileSize')}: {Math.floor((maxFileSizeInKb / 1024) * 100) / 100}{' '}
            {t('media.mb')}
          </StyledDropZoneLabelSubText>
        )}
        <StyledDropZoneInput
          type="file"
          ref={inputRef}
          multiple
          accept={acceptedFileTypes?.map(({ mimeType }) => mimeType).join(',')}
          disabled={disabled || isUploading}
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
            pending={pending}
          />
          {(pending || isUploading) && (
            <StyledDropZoneMessageText>
              {pending
                ? t('dropZone.pending')
                : t('dropZone.uploading', { progress: `${Math.ceil(progress * 100)}%` })}
            </StyledDropZoneMessageText>
          )}
        </StyledDropZoneMessage>
      </StyledDropZoneLabel>
      {!fileSizeValid && (
        <StlyedDropZoneSuccess>
          <Info>
            {t('dropZone.maxFileSizeExceeded', {
              fileSize: dropFileSizeString,
              maxFileSize: maxFileSizeString,
            })}
          </Info>
        </StlyedDropZoneSuccess>
      )}
      {success && (
        <StlyedDropZoneSuccess>
          {t('dropZone.success', { count: success.count })}
        </StlyedDropZoneSuccess>
      )}
    </StyledDropZone>
  );
};
