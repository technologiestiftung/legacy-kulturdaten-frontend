import styled from '@emotion/styled';
import { AppToken } from '../../lib/api/types/appToken';
import { useT } from '../../lib/i18n';
import { Breakpoint } from '../../lib/WindowService';
import { Button } from '../button';
import { useConfirmScreen } from '../Confirm/ConfirmScreen';
import { mq } from '../globals/Constants';

const StyledAppTokenList = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;

  font-size: var(--font-size-400);
  line-height: var(--line-height-400);

  ${mq(Breakpoint.mid)} {
    row-gap: 1.5rem;
  }
`;

const StyledAppTokenListItem = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid var(--grey-400);
  border-radius: 0.75rem;
`;

const StyledAppTokenListItemToken = styled.div`
  display: flex;
  justify-content: flex-start;
  background: var(--grey-200);
  border-bottom: 1px solid var(--grey-400);
  min-width: 0;
  max-width: 100%;
  flex-basis: 0;
  border-radius: calc(0.75rem - 1px) calc(0.75rem - 1px) 0 0;
`;

const StyledAppTokenListItemTokenLabel = styled.div`
  flex-grow: 0;
  padding: 0.75rem;
  font-weight: 700;

  ${mq(Breakpoint.mid)} {
    padding: 0.75rem 1.125rem;
  }
`;
const StyledAppTokenListItemTokenContent = styled.div`
  display: block;
  flex-basis: 0;
  width: 0;
  max-width: 100%;
  flex-grow: 1;
  background: var(--white);
`;
const StyledAppTokenListItemTokenContentInner = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  font-family: var(--font-family-mono);
  padding: 0.75rem;
  box-shadow: var(--shadow-inset);
  display: flex;

  > pre {
    &::after {
      content: '';
      display: block;
      width: 0.75rem;
    }
  }
`;
const StyledAppTokenListItemTokenRemove = styled.div`
  flex-grow: 0;
  padding: 0.375rem;
`;

const StyledAppTokenListItemDetails = styled.div`
  display: grid;
  grid-template-columns: 100%;
  column-gap: 0.75rem;
  row-gap: 0.75rem;
  padding: 0.75rem;

  ${mq(Breakpoint.mid)} {
    grid-template-columns: 1fr 1fr;
    column-gap: 1.5rem;
    row-gap: 1.5rem;
    padding: 0.75rem 1.125rem;
  }
`;
const StyledAppTokenListItemDetailsItem = styled.div``;
const StyledAppTokenListItemDetailsLabel = styled.div`
  font-weight: 700;
  padding-bottom: calc(var(--line-height-400) / 2);
`;
const StyledAppTokenListItemDetailsContent = styled.div``;

interface AppTokenListProps {
  tokens: AppToken['data']['attributes'][];
  onRemove: (tokenId: number) => Promise<void>;
}

export const AppTokenList: React.FC<AppTokenListProps> = ({
  tokens,
  onRemove,
}: AppTokenListProps) => {
  const t = useT();
  const confirmScreen = useConfirmScreen();

  return (
    <StyledAppTokenList>
      {tokens?.map(({ name, description, url, token, id }, index) => {
        return (
          <StyledAppTokenListItem key={index}>
            <StyledAppTokenListItemToken>
              <StyledAppTokenListItemTokenLabel>
                {t('settings.api.tokenTitle') as string}
              </StyledAppTokenListItemTokenLabel>
              <StyledAppTokenListItemTokenContent>
                <StyledAppTokenListItemTokenContentInner>
                  <pre>{typeof token === 'string' ? token : token?.token || ' '}</pre>
                </StyledAppTokenListItemTokenContentInner>
              </StyledAppTokenListItemTokenContent>
              <StyledAppTokenListItemTokenRemove>
                <Button
                  onClick={() => {
                    confirmScreen({
                      message: t('settings.api.tokenRemoveMessage', { tokenName: name }),
                      confirmButtonText: t('settings.api.tokenRemoveConfirm') as string,
                      title: t('settings.api.tokenRemoveTitle'),
                      onConfirm: async () => {
                        await onRemove(id);
                      },
                    });
                  }}
                >
                  {t('general.remove')}
                </Button>
              </StyledAppTokenListItemTokenRemove>
            </StyledAppTokenListItemToken>
            <StyledAppTokenListItemDetails>
              <StyledAppTokenListItemDetailsItem>
                <StyledAppTokenListItemDetailsLabel>
                  {t('settings.api.tokenName') as string}
                </StyledAppTokenListItemDetailsLabel>
                <StyledAppTokenListItemDetailsContent>{name}</StyledAppTokenListItemDetailsContent>
              </StyledAppTokenListItemDetailsItem>
              <StyledAppTokenListItemDetailsItem>
                <StyledAppTokenListItemDetailsLabel>
                  {t('settings.api.tokenDescription') as string}
                </StyledAppTokenListItemDetailsLabel>
                <StyledAppTokenListItemDetailsContent>
                  {description}
                </StyledAppTokenListItemDetailsContent>
              </StyledAppTokenListItemDetailsItem>
              <StyledAppTokenListItemDetailsItem>
                <StyledAppTokenListItemDetailsLabel>
                  {t('settings.api.tokenUrl') as string}
                </StyledAppTokenListItemDetailsLabel>
                <StyledAppTokenListItemDetailsContent>{url}</StyledAppTokenListItemDetailsContent>
              </StyledAppTokenListItemDetailsItem>
            </StyledAppTokenListItemDetails>
          </StyledAppTokenListItem>
        );
      })}
    </StyledAppTokenList>
  );
};
