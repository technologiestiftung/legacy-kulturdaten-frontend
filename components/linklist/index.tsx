import styled from '@emotion/styled';
import React, { Reducer, useEffect, useMemo, useReducer, useState } from 'react';
import { useT } from '../../lib/i18n';
import { usePseudoUID } from '../../lib/uid';
import { Breakpoint } from '../../lib/WindowService';
import { Button, ButtonSize, ButtonType } from '../button';
import { insetBorder, mq } from '../globals/Constants';
import { Info } from '../info';
import { Input, InputType } from '../input';
import { Label } from '../label';

const StyledLinkList = styled.div``;

const StyledLinkListLabel = styled.div`
  margin-bottom: 0.75rem;
`;

const StyledLinkListList = styled.ul`
  display: grid;
  grid-template-columns: auto;
  box-shadow: ${insetBorder(true)};
  border-radius: 0.75rem 0.75rem 0 0;
`;

const StyledLinkListListItem = styled.li`
  display: flex;
  align-items: stretch;
  padding: 0.375rem 0.75rem;
  box-shadow: ${insetBorder(false, false, true)};
  flex-direction: column;

  ${mq(Breakpoint.mid)} {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
`;

const StyledLinkListLink = styled.div`
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  padding: 0.375rem 0 0.375rem;
  word-break: break-all;
  flex-grow: 1;

  ${mq(Breakpoint.mid)} {
    padding: 0.375rem 0.75rem 0.375rem 0;
  }
`;

const StyledLinkListLinkButton = styled.div`
  padding: 0.375rem 0;
  margin-right: 0.75rem;

  :last-of-type {
    margin-right: 0;
  }
`;

const StyledLinkListLinkButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-self: flex-end;
`;

const StyledLinkListAddNew = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0.375rem 0.75rem;
  box-shadow: ${insetBorder(false, true, true, true)};
  border-radius: 0 0 0.75rem 0.75rem;

  ${mq(Breakpoint.mid)} {
    justify-content: space-between;
    align-items: flex-end;
    flex-direction: row;
  }
`;

const StyledLinkListInput = styled.div`
  flex-grow: 1;
  padding-right: 0.75rem;
  padding: 0.375rem 0;
`;

const StyledLinkListInputButton = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  padding: 0.375rem 0;
  align-self: flex-end;

  ${mq(Breakpoint.mid)} {
    padding: 0.375rem 0 0.375rem 0.75rem;
  }
`;

const StyledLinkListInfo = styled.div`
  padding: 0.75rem 0.75rem 0;
  box-shadow: ${insetBorder(false, true)};
`;

enum LinksActions {
  add = 'add',
  update = 'update',
  delete = 'delete',
  init = 'init',
}

type LinksState = string[];

type LinksAction = {
  type: LinksActions;
  payload: {
    link?: {
      index?: number;
      value?: string;
    };
    links?: string[];
  };
};

const linksReducer: Reducer<LinksState, LinksAction> = (state, action) => {
  switch (action.type) {
    case LinksActions.add: {
      return [...state, action.payload.link.value];
    }

    case LinksActions.update: {
      const updatedState = [...state];
      updatedState[action.payload.link.index] = action.payload.link.value;
      return updatedState;
    }

    case LinksActions.delete: {
      return state
        .slice(0, action.payload.link.index)
        .concat(state.slice(action.payload.link.index + 1));
    }

    case LinksActions.init: {
      return action.payload.links;
    }

    default: {
      break;
    }
  }
};

interface LinkListProps {
  links?: string[];
  label: string;
  onChange?: (updatedLinks: string[]) => void;
  maxLinks?: number;
}

export const LinkList: React.FC<LinkListProps> = ({
  links,
  label,
  onChange,
  maxLinks,
}: LinkListProps) => {
  const t = useT();
  const externalValue = useMemo(() => links, [links]);
  const [externalValueDefined, setExternalValueDefined] = useState<boolean>(false);
  const uid = usePseudoUID();

  const [linksState, dispatch] = useReducer(linksReducer, externalValue || []);
  const [inputState, setInputState] = useState<string>('');

  const maxLinksReached = useMemo<boolean>(() => maxLinks && linksState.length >= maxLinks, [
    linksState,
    maxLinks,
  ]);

  useEffect(() => {
    if (!externalValueDefined && externalValue && externalValue.length > 0) {
      setExternalValueDefined(true);
      dispatch({
        type: LinksActions.init,
        payload: {
          links: externalValue || [],
        },
      });
    }
  }, [externalValue, linksState, externalValueDefined]);

  useEffect(() => {
    if (onChange) {
      onChange(linksState);
    }
  }, [linksState, onChange]);

  return (
    <StyledLinkList>
      <StyledLinkListLabel>
        <Label>
          {label}
          {maxLinks ? ` (${t('linkList.maxLinks', { amount: maxLinks })})` : ''}
        </Label>
      </StyledLinkListLabel>
      <StyledLinkListList>
        {linksState.map((link, index) => (
          <StyledLinkListListItem key={index}>
            <StyledLinkListLink>
              <Input
                type={InputType.url}
                id={`linklist-${uid}-link-${index}`}
                value={link}
                onChange={(e) =>
                  dispatch({
                    type: LinksActions.update,
                    payload: { link: { index, value: e.target.value } },
                  })
                }
              />
            </StyledLinkListLink>
            <StyledLinkListLinkButtons>
              <StyledLinkListLinkButton>
                <Button
                  size={ButtonSize.default}
                  onClick={() =>
                    dispatch({ type: LinksActions.delete, payload: { link: { index } } })
                  }
                  icon="Trash2"
                >
                  {t('general.delete')}
                </Button>
              </StyledLinkListLinkButton>
            </StyledLinkListLinkButtons>
          </StyledLinkListListItem>
        ))}
      </StyledLinkListList>
      {maxLinksReached && (
        <StyledLinkListInfo>
          <Info>{t('linkList.maxReached', { amount: maxLinks })}</Info>
        </StyledLinkListInfo>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();

          if (!maxLinksReached && inputState.length > 0) {
            dispatch({
              type: LinksActions.add,
              payload: { link: { value: inputState } },
            });

            setInputState('');
          }
        }}
      >
        <StyledLinkListAddNew>
          <StyledLinkListInput>
            <Input
              type={InputType.url}
              id={`linklist-${uid}-add`}
              value={inputState}
              onChange={(e) => setInputState(e.target.value)}
              label={t('linkList.addNew') as string}
              disabled={maxLinksReached}
            />
          </StyledLinkListInput>
          <StyledLinkListInputButton>
            <Button icon="Plus" type={ButtonType.submit} disabled={inputState.length < 1}>
              {t('general.add')}
            </Button>
          </StyledLinkListInputButton>
        </StyledLinkListAddNew>
      </form>
    </StyledLinkList>
  );
};
