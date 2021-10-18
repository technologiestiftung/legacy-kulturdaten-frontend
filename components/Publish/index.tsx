import styled from '@emotion/styled';
import { ParsedUrlQuery } from 'node:querystring';
import { useMemo } from 'react';
import { useApiCall } from '../../lib/api';
import { Requirement } from './Requirement';
import { OrganizerShow } from '../../lib/api/routes/organizer/show';
import { OrganizerUpdate } from '../../lib/api/routes/organizer/update';
import { PublishedStatus } from '../../lib/api/types/general';
import { Organizer } from '../../lib/api/types/organizer';
import { Category, useEntry, useMutateList } from '../../lib/categories';
import { useT } from '../../lib/i18n';
import { Breakpoint } from '../../lib/WindowService';
import { Button, ButtonColor, ButtonSize } from '../button';
import { contentGrid, mq } from '../globals/Constants';
import { Label } from '../label';
import { Requirement as RequirementType } from '../../config/categories';
import { useLoadingScreen } from '../Loading/LoadingScreen';

const StyledPublish = styled.div`
  ${contentGrid(1)}

  row-gap: 0.75rem;

  ${mq(Breakpoint.mid)} {
    ${contentGrid(6)}
  }
`;

const StyledPublishLabel = styled.div`
  grid-column: 1 / -1;
`;

const StyledPublishRequirements = styled.div`
  display: grid;
  grid-template-columns: auto;
  column-gap: 0.75rem;
  row-gap: 0.75rem;
  grid-column: 1 / -1;

  ${mq(Breakpoint.widish)} {
    grid-column: 1 / span 4;
    grid-template-columns: 1fr 1fr;
  }
`;

const StyledPublishAction = styled.div`
  grid-column: 1 / -1;

  display: flex;
  justify-content: flex-end;
  align-self: flex-end;
  align-items: center;

  ${mq(Breakpoint.widish)} {
    grid-column: 5 / span 2;
    grid-template-columns: 1fr 1fr;
  }
`;

interface PublishProps {
  category: Category;
  query: ParsedUrlQuery;
  requirements: RequirementType[];
}

export const Publish: React.FC<PublishProps> = ({
  category,
  query,
  requirements,
}: PublishProps) => {
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const call = useApiCall();
  const mutateList = useMutateList(category);
  const loadingScreen = useLoadingScreen();

  const t = useT();

  const isPublishable = useMemo(
    () => entry?.meta?.publishable === true,
    [entry?.meta?.publishable]
  );

  const failedPublishedRequirements =
    typeof entry?.meta?.publishable === 'object' &&
    Object.entries(entry?.meta?.publishable).length > 0
      ? entry?.meta?.publishable
      : undefined;

  const requirementsFulfillment = useMemo(
    () =>
      requirements.map((requirement) => ({
        requirement,
        fulfilled: requirement.publishableKeys.reduce((fulfilled, publishableKey) => {
          if (
            failedPublishedRequirements &&
            failedPublishedRequirements.hasOwnProperty(publishableKey)
          ) {
            return false;
          }

          return fulfilled;
        }, true),
      })),
    [failedPublishedRequirements, requirements]
  );

  return (
    <StyledPublish role="group">
      <StyledPublishLabel>
        <Label>{t('categories.organizer.requirements.label')}</Label>
      </StyledPublishLabel>
      <StyledPublishRequirements>
        {requirementsFulfillment.map((fulfillment, index) => (
          <Requirement
            key={index}
            text={t(fulfillment.requirement.translationKey) as string}
            fulfilled={fulfillment.fulfilled}
          />
        ))}
      </StyledPublishRequirements>
      <StyledPublishAction>
        <Button
          size={ButtonSize.big}
          color={ButtonColor.green}
          icon="Heart"
          disabled={!isPublishable}
          onClick={async () =>
            loadingScreen(
              t('publish.loadingTitle', { categoryName: category.title.singular }),
              async () => {
                try {
                  const resp = await call<OrganizerUpdate>(category.api.update.factory, {
                    id: entry.data.id,
                    entry: {
                      attributes: {
                        status: PublishedStatus.published,
                      },
                    },
                  });

                  if (resp.status === 200) {
                    mutate();
                    mutateList();

                    return { success: true };
                  }
                } catch (e) {
                  console.error(e);
                  return { success: false, error: t('general.serverProblem') };
                }
              },
              t('general.takeAFewSeconds')
            )
          }
        >
          {t('general.publish')}
        </Button>
      </StyledPublishAction>
    </StyledPublish>
  );
};
