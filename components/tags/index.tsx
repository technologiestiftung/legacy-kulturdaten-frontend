import { Autocomplete, TextField } from '@mui/material';

import React, { Reducer, useEffect, useMemo, useReducer, useState } from 'react';
import { Button, ButtonColor, ButtonType } from '../button';
import styled from '@emotion/styled';
import { useT } from '../../lib/i18n';
import { XCircle } from 'react-feather';
import { Label } from '../label';
import { inputStyles } from '../input';
import { mq } from '../globals/Constants';
import { Breakpoint } from '../../lib/WindowService';
import { Tag } from '../../lib/api/types/tag';
import { getTranslation } from '../../lib/translations';
import { useLanguage } from '../../lib/routing';
import { usePseudoUID } from '../../lib/uid';

const StyledTextField = styled(TextField)`
  flex-grow: 1;

  .MuiOutlinedInput-notchedOutline {
    border: none;
  }

  .MuiOutlinedInput-root {
    padding: 0 !important;
  }

  .MuiAutocomplete-endAdornment {
    display: none;
    visibility: hidden;
  }

  .MuiAutocomplete-inputRoot[class*='MuiOutlinedInput-root'] .MuiAutocomplete-input,
  .MuiAutocomplete-inputRoot[class*='MuiOutlinedInput-root'] .MuiAutocomplete-input:first-of-type,
  input {
    height: unset;
    ${inputStyles({})}
  }
`;

const StyledTags = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledTagsLabel = styled.div`
  margin-bottom: 0.75rem;
`;

const StyledTagsBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

const StyledTagsBoxPlaceholder = styled.div`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  margin-bottom: 0.75rem;
`;

const StyledTagsTag = styled.div`
  display: flex;
  border: 1px solid var(--grey-400);
  border-radius: 0.375rem;
  padding: 0 0.375rem 0 0.75rem;
  margin-right: 0.75rem;
  margin-bottom: 0.75rem;
  align-items: flex-start;
`;

const StyledTagsTagText = styled.div`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  padding: 0.375rem 0;
`;
const StyledTagsTagX = styled.button`
  appearance: none;
  padding: 0;
  border: none;
  background: none;
  padding: 0.375rem 0;
  cursor: pointer;
  margin: 0 0 0 0.375rem;

  svg {
    width: 1.125rem;
    height: 1.125rem;
    display: block;
    padding: 0.1875rem;
  }
`;

const StyledTagsAutocomplete = styled.div`
  width: 100%;
`;

const StyledTagsAutocompleteContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  ${mq(Breakpoint.mid)} {
    flex-direction: row;
  }
`;

const StyledAutocomplete = styled(Autocomplete)`
  flex-grow: 1;
  margin-bottom: 0.375rem;

  ${mq(Breakpoint.mid)} {
    margin-bottom: 0;
    margin-right: 0.375rem;
  }
`;

const StyledTagsAutocompleteButton = styled.div`
  display: flex;
  justify-content: flex-end;
`;

enum TagsActions {
  add = 'add',
  delete = 'delete',
  init = 'init',
}

type TagsState = Tag['id'][];

type TagsAction = {
  type: TagsActions;
  payload: {
    tagId?: Tag['id'];
    tagIds?: Tag['id'][];
  };
};

const tagsReducer: Reducer<TagsState, TagsAction> = (state, action) => {
  switch (action.type) {
    case TagsActions.add: {
      if (!action.payload.tagId || state.includes(action.payload.tagId)) {
        return state;
      }

      return [...state, action.payload.tagId];
    }

    case TagsActions.delete: {
      return state.filter((tagId) => tagId !== action.payload.tagId);
    }

    case TagsActions.init: {
      return action.payload.tagIds;
    }

    default: {
      break;
    }
  }
};

interface TagsProps {
  options: Tag[];
  value?: Tag['id'][];
  onChange?: (newValue: Tag['id'][]) => void;
}

export const Tags: React.FC<TagsProps> = ({ value, onChange, options }: TagsProps) => {
  const [tags, dispatchTags] = useReducer(tagsReducer, value || []);
  const [inputValue, setInputValue] = useState<string>('');
  const [autocompleteValue, setAutocompleteValue] = useState<{ label: string; id: number }>(null);
  const t = useT();
  const language = useLanguage();
  const uid = usePseudoUID();

  const autocompleteOptions = useMemo(
    () =>
      options?.map((option) => {
        const translation = getTranslation(language, option.relations.translations);

        return {
          label: translation.attributes.name,
          id: option.id,
        };
      }),
    [options, language]
  );

  const [pristine, setPristine] = useState(true);

  useEffect(() => {
    if (onChange) {
      onChange(tags);
    }
  }, [onChange, tags]);

  useEffect(() => {
    if (
      pristine &&
      (typeof tags === 'undefined' || (Array.isArray(tags) && tags.length === 0)) &&
      Array.isArray(value) &&
      value.length > 0
    ) {
      setPristine(false);
      dispatchTags({ type: TagsActions.init, payload: { tagIds: value } });
    }
  }, [tags, value, pristine]);

  return (
    <StyledTags>
      <StyledTagsLabel>
        <Label>{t('tags.boxLabel')}</Label>
      </StyledTagsLabel>
      <StyledTagsBox>
        {tags && tags.length > 0 ? (
          options
            ?.filter((option) => tags.includes(option.id))
            .map((option, index) => {
              const translation = getTranslation(language, option.relations.translations);

              return (
                <StyledTagsTag key={index}>
                  <StyledTagsTagText>{translation.attributes.name}</StyledTagsTagText>
                  <StyledTagsTagX
                    aria-label={t('tags.delete') as string}
                    type="button"
                    onClick={() =>
                      dispatchTags({
                        type: TagsActions.delete,
                        payload: {
                          tagId: option.id,
                        },
                      })
                    }
                  >
                    <XCircle color="var(--black)" />
                  </StyledTagsTagX>
                </StyledTagsTag>
              );
            })
        ) : (
          <StyledTagsBoxPlaceholder>{t('tags.placeholder')}</StyledTagsBoxPlaceholder>
        )}
      </StyledTagsBox>
      <StyledTagsAutocomplete>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (autocompleteValue?.id) {
              dispatchTags({ type: TagsActions.add, payload: { tagId: autocompleteValue.id } });
              setAutocompleteValue(null);
              setInputValue('');
            }
          }}
        >
          <StyledTagsLabel>
            <Label htmlFor={`tags-${uid}`}>{t('tags.autocompleteLabel')}</Label>
          </StyledTagsLabel>
          <StyledTagsAutocompleteContainer>
            <StyledAutocomplete
              id={`tags-${uid}`}
              options={autocompleteOptions}
              value={autocompleteValue}
              onChange={(e, newValue) => {
                setAutocompleteValue(
                  newValue ? (newValue as { label: string; id: number }) : { label: '', id: null }
                );
                setInputValue(newValue ? (newValue as { label: string; id: number }).label : '');
              }}
              noOptionsText={t('tags.noOptions')}
              renderInput={(params) => (
                <StyledTextField
                  {...params}
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                  }}
                  variant="outlined"
                  autoComplete="off"
                />
              )}
            />
            <StyledTagsAutocompleteButton>
              <Button type={ButtonType.submit} color={ButtonColor.black}>
                {t('tags.add')}
              </Button>
            </StyledTagsAutocompleteButton>
          </StyledTagsAutocompleteContainer>
        </form>
      </StyledTagsAutocomplete>
    </StyledTags>
  );
};
