import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';

import React, { Reducer, useEffect, useReducer, useState } from 'react';
import { Button, ButtonColor, ButtonType } from '../button';
import styled from '@emotion/styled';
import { useT } from '../../lib/i18n';
import { XCircle } from 'react-feather';
import { Label } from '../label';
import { inputStyles } from '../input';
import { mq } from '../globals/Constants';
import { Breakpoint } from '../../lib/WindowService';

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
  padding: 0 0.75rem;
  margin-right: 0.75rem;
  margin-bottom: 0.75rem;
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
  margin-left: 0.75rem;

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

type TagsState = string[];

type TagsAction = {
  type: TagsActions;
  payload: {
    tag?: string;
    tags?: string[];
  };
};

const tagsReducer: Reducer<TagsState, TagsAction> = (state, action) => {
  switch (action.type) {
    case TagsActions.add: {
      if (action.payload.tag.length < 1 || state.includes(action.payload.tag)) {
        return state;
      }

      return [...state, action.payload.tag];
    }

    case TagsActions.delete: {
      return state.filter((tag) => tag !== action.payload.tag);
    }

    case TagsActions.init: {
      return action.payload.tags;
    }

    default: {
      break;
    }
  }
};

interface TagsProps {
  options: string[];
  value?: string[];
  onChange?: (newValue: string[]) => void;
}

export const Tags: React.FC<TagsProps> = ({ value, onChange, options }: TagsProps) => {
  const [tags, dispatchTags] = useReducer(tagsReducer, value || []);
  const [inputValue, setInputValue] = useState<string>('');
  const [autocompleteValue, setAutocompleteValue] = useState<string>('');
  const t = useT();

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
      dispatchTags({ type: TagsActions.init, payload: { tags: value } });
    }
  }, [tags, value, pristine]);

  return (
    <StyledTags>
      <StyledTagsLabel>
        <Label>{t('tags.boxLabel')}</Label>
      </StyledTagsLabel>
      <StyledTagsBox>
        {tags && tags.length > 0 ? (
          tags.map((tag, index) => (
            <StyledTagsTag key={index}>
              <StyledTagsTagText>{tag} </StyledTagsTagText>
              <StyledTagsTagX
                aria-label={t('tags.delete') as string}
                type="button"
                onClick={() =>
                  dispatchTags({
                    type: TagsActions.delete,
                    payload: {
                      tag,
                    },
                  })
                }
              >
                <XCircle color="var(--black)" />
              </StyledTagsTagX>
            </StyledTagsTag>
          ))
        ) : (
          <StyledTagsBoxPlaceholder>{t('tags.placeholder')}</StyledTagsBoxPlaceholder>
        )}
      </StyledTagsBox>
      <StyledTagsAutocomplete>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            dispatchTags({ type: TagsActions.add, payload: { tag: inputValue } });
            setAutocompleteValue('');
            setInputValue('');
          }}
        >
          <StyledTagsLabel>
            <Label htmlFor="tags-f">{t('tags.autocompleteLabel')}</Label>
          </StyledTagsLabel>
          <StyledTagsAutocompleteContainer>
            <StyledAutocomplete
              id="tags-f"
              freeSolo
              options={options}
              value={autocompleteValue}
              onChange={(e, newValue) => {
                setAutocompleteValue(newValue as string);
                setInputValue(newValue as string);
              }}
              renderInput={(params) => (
                <StyledTextField
                  {...params}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  variant="outlined"
                  autoComplete="off"
                />
              )}
            />
            <StyledTagsAutocompleteButton>
              <Button type={ButtonType.submit} color={ButtonColor.green}>
                {t('tags.add')}
              </Button>
            </StyledTagsAutocompleteButton>
          </StyledTagsAutocompleteContainer>
        </form>
      </StyledTagsAutocomplete>
    </StyledTags>
  );
};
