import styled from '@emotion/styled';
import React, {
  Dispatch,
  Reducer,
  ReducerState,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { useT } from '../../lib/i18n';
import { usePseudoUID } from '../../lib/uid';
import { isUrl } from '../../lib/validations';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { Button, ButtonSize, ButtonType } from '../button';
import { insetBorder, mq } from '../globals/Constants';
import { Info, InfoColor } from '../info';
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

const StyledLinkListListPlaceholder = styled.p`
  padding: 0.75rem;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);

  ${mq(Breakpoint.mid)} {
    padding: 0.75rem 1.5rem;
  }
`;

const StyledLinkListListItem = styled.li`
  display: flex;
  align-items: stretch;
  padding: 0.75rem;
  box-shadow: ${insetBorder(false, false, true)};
  flex-direction: column;

  ${mq(Breakpoint.mid)} {
    padding: 0.75rem 1.5rem;
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
  padding: 0.75rem;
  box-shadow: ${insetBorder(false, true, true, true)};
  border-radius: 0 0 0.75rem 0.75rem;

  ${mq(Breakpoint.mid)} {
    padding: 0.75rem 1.5rem;
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

  ${mq(Breakpoint.mid)} {
    padding: 0.75rem 1.5rem 0;
  }
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

type LinkListProps = {
  linksState: ReducerState<Reducer<LinksState, LinksAction>>;
  dispatch: Dispatch<LinksAction>;
  links?: string[];
  label?: string;
  onChange?: (updatedLinks: string[]) => void;
  maxLinks?: number;
  required?: boolean;
};

const LinkList: React.FC<LinkListProps> = ({
  links,
  label,
  onChange,
  maxLinks,
  linksState,
  dispatch,
}: LinkListProps) => {
  const t = useT();
  const externalValue = useMemo(() => links, [links]);
  const [externalValueDefined, setExternalValueDefined] = useState<boolean>(false);
  const uid = usePseudoUID();
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);

  const [inputState, setInputState] = useState<string>('');

  const maxLinksReached = useMemo<boolean>(
    () => maxLinks && linksState?.length >= maxLinks,
    [linksState, maxLinks]
  );

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
  }, [dispatch, externalValue, linksState, externalValueDefined]);

  useEffect(() => {
    if (onChange) {
      onChange(linksState);
    }
  }, [linksState, onChange]);

  return (
    <StyledLinkList>
      {label && (
        <StyledLinkListLabel>
          <Label>
            {label}
            {maxLinks ? ` (${t('linkList.maxLinks', { amount: maxLinks })})` : ''}
          </Label>
        </StyledLinkListLabel>
      )}
      <StyledLinkListList>
        {linksState && linksState.length > 0 ? (
          linksState.map((link, index) => (
            <StyledLinkListListItem key={index}>
              <StyledLinkListLink>
                <Input
                  type={InputType.url}
                  id={`linklist-${uid}-link-${index}`}
                  value={link}
                  autoComplete="url"
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
                    size={isMidOrWider ? ButtonSize.big : ButtonSize.default}
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
          ))
        ) : (
          <StyledLinkListListPlaceholder>{t('linkList.placeholder')}</StyledLinkListListPlaceholder>
        )}
      </StyledLinkListList>
      {maxLinksReached && (
        <StyledLinkListInfo>
          <Info color={InfoColor.grey}>{t('linkList.maxReached', { amount: maxLinks })}</Info>
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
              autoComplete="url"
              onChange={(e) => setInputState(e.target.value)}
              label={t('linkList.addNew') as string}
              placeholder={t('linkList.inputPlaceholder') as string}
              disabled={maxLinksReached}
            />
          </StyledLinkListInput>
          <StyledLinkListInputButton>
            <Button
              icon="Plus"
              type={ButtonType.submit}
              disabled={inputState.length < 1}
              size={isMidOrWider ? ButtonSize.big : ButtonSize.default}
            >
              {t('general.add')}
            </Button>
          </StyledLinkListInputButton>
        </StyledLinkListAddNew>
      </form>
    </StyledLinkList>
  );
};

export const useLinkList = (
  props: Omit<LinkListProps, 'linksState' | 'dispatch'>
): {
  renderedLinkList: React.ReactElement<LinkListProps>;
  init: (links: string[]) => void;
  valid: boolean;
} => {
  const [linksState, dispatch] = useReducer(linksReducer, props?.links || []);

  const valid = useMemo(() => {
    if (linksState?.length > 0) {
      for (let i = 0; i < linksState?.length; i += 1) {
        if (!isUrl(linksState[i])) {
          return false;
        }
      }
      return true;
    }

    if (props?.required !== true) {
      return true;
    }

    return false;
  }, [linksState, props?.required]);

  return {
    renderedLinkList: <LinkList {...props} linksState={linksState} dispatch={dispatch} />,
    init: (links: string[]) => dispatch({ type: LinksActions.init, payload: { links } }),
    valid,
  };
};
