import styled from '@emotion/styled';
import { Reducer, useReducer, useState } from 'react';
import { Breakpoint } from '../../lib/WindowService';
import { Button, ButtonSize, ButtonType } from '../button';
import { insetBorder, mq } from '../globals/Constants';
import { Input, InputType } from '../input';
import { Label } from '../label';

const StyledLinkList = styled.div``;

const StyledLinkListLabel = styled.div`
  padding: 0.75rem;
  box-shadow: ${insetBorder(false, false, true)};
`;

const StyledList = styled.ul`
  display: grid;
  grid-template-columns: auto;
`;

const StyledListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.375rem 0.75rem;
  box-shadow: ${insetBorder(false, false, true)};
  flex-wrap: wrap;
`;

const StyledLink = styled.div`
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  padding: 0.75rem 0 0.375rem;
  word-break: break-all;
`;

const StyledLinkButton = styled.div`
  padding: 0.375rem 0;
  margin-right: 0.75rem;

  :last-of-type {
    margin-right: 0;
  }
`;

const StyledLinkButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const StyledLinkListAddNew = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0.375rem 0.75rem;

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

  ${mq(Breakpoint.mid)} {
    padding: 0.375rem 0 0.375rem 0.75rem;
  }
`;

enum LinksActions {
  update = 'update',
  delete = 'delete',
}

type LinksState = {
  [key: string]: string;
};

type LinksAction = {
  type: LinksActions;
  payload: {
    id: string;
    link?: string;
  };
};

const linksReducer: Reducer<LinksState, LinksAction> = (state, action) => {
  switch (action.type) {
    case LinksActions.update: {
      return { ...state, [action.payload.id]: action.payload.link };
    }

    case LinksActions.delete: {
      const updatedState = { ...state };

      delete updatedState[action.payload.id];

      return updatedState;
    }

    default: {
      break;
    }
  }
};

interface LinkListProps {
  links: {
    value: string;
  }[];
  label: string;
}

export const LinkList: React.FC<LinkListProps> = ({ links, label }: LinkListProps) => {
  const [linksState, dispatch] = useReducer(
    linksReducer,
    links?.reduce((combined, { value }, index) => {
      return { ...combined, [index]: value };
    }, {}) || {}
  );

  const [inputState, setInputState] = useState<string>('');

  return (
    <StyledLinkList>
      <StyledLinkListLabel>
        <Label>{label}</Label>
      </StyledLinkListLabel>
      <StyledList>
        {Object.entries(linksState).map(([id, link], index) => (
          <StyledListItem key={index}>
            <StyledLink>{link}</StyledLink>
            <StyledLinkButtons>
              <StyledLinkButton>
                <Button size={ButtonSize.default} icon="Edit">
                  bearbeiten
                </Button>
              </StyledLinkButton>
              <StyledLinkButton>
                <Button
                  size={ButtonSize.default}
                  onClick={() => dispatch({ type: LinksActions.delete, payload: { id } })}
                  icon="Trash2"
                >
                  löschen
                </Button>
              </StyledLinkButton>
            </StyledLinkButtons>
          </StyledListItem>
        ))}
      </StyledList>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();

          if (inputState.length > 0) {
            dispatch({
              type: LinksActions.update,
              payload: { id: `${Object.values(linksState).length}`, link: inputState },
            });

            setInputState('');
          }
        }}
      >
        <StyledLinkListAddNew>
          <StyledLinkListInput>
            <Input
              type={InputType.url}
              id="ll-1"
              value={inputState}
              onChange={(e) => setInputState(e.target.value)}
              label="Neu hinzufügen"
            />
          </StyledLinkListInput>
          <StyledLinkListInputButton>
            <Button icon="Plus" type={ButtonType.submit} disabled={inputState.length < 1}>
              hinzufügen
            </Button>
          </StyledLinkListInputButton>
        </StyledLinkListAddNew>
      </form>
    </StyledLinkList>
  );
};
