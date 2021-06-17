import styled from '@emotion/styled';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { useT } from '../../lib/i18n';
import { mq } from '../globals/Constants';
import { PublishedStatus } from '../../lib/api/types/general';

const StyledStatusBar = styled.div`
  display: flex;
  position: relative;
  border-bottom: 1px solid var(--grey-400);
`;

const StyledStatusBarFlag = styled.div<{ backgroundColor: string }>`
  background: ${({ backgroundColor }) => backgroundColor};
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  margin-left: 0.75rem;
  padding: 0 0.375rem;
  border-radius: 0.375rem 0.375rem 0 0;

  ${mq(Breakpoint.mid)} {
    padding: 0.375rem 0.75rem;
  }
`;

const StatusBarLabel = styled.div`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  padding: 0;
  margin-right: 0.75rem;

  ${mq(Breakpoint.mid)} {
    padding: 0.375rem 0;
  }
`;

const StyledStatusBarInfo = styled.div`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  position: relative;
  flex-grow: 1;
  text-align: right;
  padding: 0;

  ${mq(Breakpoint.mid)} {
    padding: 0.375rem 0;
  }
`;

const StyledStatusBarInfoBold = styled.span`
  font-weight: 700;
`;

const StyledStatusBarInfoDate = styled.span``;

const statusBarStatuses: {
  [key in PublishedStatus]: { backgroundColor: string; textKey: string };
} = {
  draft: {
    backgroundColor: 'var(--mustard)',
    textKey: 'statusBar.draft',
  },
  published: {
    backgroundColor: 'var(--green-light)',
    textKey: 'statusBar.published',
  },
};

const useStatusBarFlag = (status = PublishedStatus.draft): React.ReactElement => {
  const t = useT();

  return (
    <StyledStatusBarFlag backgroundColor={statusBarStatuses[status].backgroundColor}>
      {t(statusBarStatuses[status].textKey)}
    </StyledStatusBarFlag>
  );
};

interface StatusBarProps {
  status: PublishedStatus;
  date?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ date, status }: StatusBarProps) => {
  const flag = useStatusBarFlag(status);
  const t = useT();
  const midOrWider = useBreakpointOrWider(Breakpoint.mid);

  return (
    <StyledStatusBar>
      <StatusBarLabel>{t('statusBar.status')}</StatusBarLabel>
      <StyledStatusBarInfo>
        {date && (
          <>
            <StyledStatusBarInfoBold>
              {midOrWider ? t('statusBar.saved') : t('statusBar.savedShort')}
            </StyledStatusBarInfoBold>{' '}
            <StyledStatusBarInfoDate>{date}</StyledStatusBarInfoDate>
          </>
        )}
      </StyledStatusBarInfo>
      {flag}
    </StyledStatusBar>
  );
};
