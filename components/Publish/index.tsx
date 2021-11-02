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
import { Label, StyledLabel } from '../label';
import { Categories } from '../../config/categories';
import { useLoadingScreen } from '../Loading/LoadingScreen';
import { useOrganizerId } from '../../lib/useOrganizer';
import { StatusFlag, StatusFlagVariant } from '../Status/StatusFlag';

const StyledPublish = styled.div`
  ${contentGrid(1)}
  background: var(--grey-200);
  box-shadow: inset 0 -0.4375rem 0.75rem -0.75rem rgba(0, 0, 0, 0.25);

  padding: 1.5rem 0.75rem;
  row-gap: 1.5rem;

  ${mq(Breakpoint.mid)} {
    ${contentGrid(8)}

    row-gap: 2.25rem;
    padding: 1.5rem;
  }

  ${mq(Breakpoint.widish)} {
    row-gap: 2.25rem;
    padding: 2.25rem 0;
  }
`;

const StyledPublishHead = styled.div`
  grid-column: 1 / -1;
  max-width: var(--max-content-width);
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;

  ${mq(Breakpoint.widish)} {
    grid-column: 2 / -2;
  }
`;

const StyledPublishHeadline = styled.h2`
  font-size: var(--font-size-500);
  line-height: var(--line-height-500);
  font-weight: 700;
`;

const StyledPublishBody = styled.div`
  grid-column: 1 / -1;
  display: flex;
  row-gap: 1.5rem;
  column-gap: 0.75rem;
  max-width: var(--max-content-width);
  width: 100%;
  margin: 0 auto;
  flex-direction: column;

  ${mq(Breakpoint.mid)} {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }

  ${mq(Breakpoint.widish)} {
    grid-column: 2 / -2;
  }
`;

const StyledPublishHeadText = styled.p`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  max-width: 78ch;
`;

const StyledPublishRequirements = styled.div``;

const StyledPublishRequirementsItems = styled.div`
  display: flex;
  column-gap: 0.75rem;
  row-gap: 0.75rem;
  flex-direction: row;
  flex-wrap: wrap;
`;

const StyledPublishRequirementsLabel = styled.div`
  margin-bottom: 0.375rem;
  display: flex;
  column-gap: 0.375rem;
  row-gap: 0.375rem;

  ${StyledLabel} {
    font-size: var(--font-size-300);
    line-height: var(--line-height-300);
  }
`;

const StyledPublishRequirementsLabelCount = styled.span`
  display: block;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
`;

const StyledPublishAction = styled.div`
  display: flex;

  > * {
    width: 100%;
  }

  ${mq(Breakpoint.mid)} {
    justify-content: flex-end;
    align-self: flex-end;
    align-items: center;
  }
`;

interface PublishProps {
  category: Category;
  query: ParsedUrlQuery;
}

export const Publish: React.FC<PublishProps> = ({ category, query }: PublishProps) => {
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const call = useApiCall();
  const organizerId = useOrganizerId();
  const mutateList = useMutateList(
    category,
    category.name === Categories.location
      ? [['organizer', organizerId]]
      : category.name === Categories.offer
      ? [['organizers', organizerId]]
      : undefined
  );
  const loadingScreen = useLoadingScreen();
  const requirements = category?.requirements;

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
      <StyledPublishHead>
        <StyledPublishHeadline>{t('requirements.title')}</StyledPublishHeadline>
        <StyledPublishHeadText>{category.publishText}</StyledPublishHeadText>
      </StyledPublishHead>
      <StyledPublishBody>
        <StyledPublishRequirements>
          <StyledPublishRequirementsLabel>
            <Label>{t('requirements.label')} </Label>
            <StyledPublishRequirementsLabelCount>
              {t('requirements.fulfilled', {
                count:
                  requirements.length -
                  (failedPublishedRequirements
                    ? Object.values(failedPublishedRequirements)?.length || 0
                    : 0),
                total: requirements.length,
              })}
            </StyledPublishRequirementsLabelCount>
          </StyledPublishRequirementsLabel>
          <StyledPublishRequirementsItems>
            {requirementsFulfillment.map((fulfillment, index) => (
              <Requirement
                key={index}
                text={t(fulfillment.requirement.translationKey) as string}
                fulfilled={fulfillment.fulfilled}
              />
            ))}
          </StyledPublishRequirementsItems>
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
      </StyledPublishBody>
    </StyledPublish>
  );
};
