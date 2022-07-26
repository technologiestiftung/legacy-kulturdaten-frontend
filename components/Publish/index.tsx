import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { ParsedUrlQuery } from 'node:querystring';
import { useMemo } from 'react';
import { useApiCall } from '../../lib/api';
import { Requirement, RequirementProps } from './Requirement';
import { OrganizerShow } from '../../lib/api/routes/organizer/show';
import { Organizer } from '../../lib/api/types/organizer';
import { Category, useEntry, useMutateList } from '../../lib/categories';
import { useT } from '../../lib/i18n';
import { Breakpoint } from '../../lib/WindowService';
import { Button, ButtonColor, ButtonSize } from '../button';
import { contentGrid, mq } from '../globals/Constants';
import { Label, StyledLabel } from '../label';
import { useLoadingScreen } from '../Loading/LoadingScreen';
import { Categories, RequirementFulfillment } from '../../config/categories';
import { useRouter } from 'next/router';
import { PublishedStatus } from '../../lib/api/types/general';
import { useOrganizerId } from '../../lib/useOrganizer';

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

const StyledPublishRequirementsItems = styled.ul`
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
  category?: Category;
  query?: ParsedUrlQuery;
  requirements?: RequirementProps[];
  onPublish?: () => Promise<void>;
}

export const Publish: React.FC<PublishProps> = ({
  category,
  query,
  requirements,
  onPublish,
}: PublishProps) => {
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const call = useApiCall();
  const loadingScreen = useLoadingScreen();
  const categoryName = category?.name;
  const organizerId = useOrganizerId();
  const mutateList = useMutateList(
    category,
    categoryName === Categories.location
      ? [['organizer', organizerId]]
      : categoryName === Categories.offer
      ? [['organizers', organizerId]]
      : undefined
  );
  const t = useT();

  const fulfilledRequirementsCount = useMemo(
    () => requirements?.filter(({ fulfilled }) => fulfilled)?.length,
    [requirements]
  );

  const publishable = useMemo(
    () => fulfilledRequirementsCount === requirements.length,
    [fulfilledRequirementsCount, requirements]
  );

  const entryIsPublishable = useMemo(() => entry?.meta?.publishable, [entry?.meta?.publishable]);

  const waitForSave = (intervalInMs = 250, thresholdInMs = 5000) => {
    return new Promise<{ success: boolean }>((resolve) => {
      let timer = 0;
      const interval = setInterval(() => {
        timer += intervalInMs;
        if (entryIsPublishable) {
          resolve({ success: true });
          clearInterval(interval);
        } else if (timer > thresholdInMs) {
          resolve({ success: false });
          clearInterval(interval);
        }
      }, intervalInMs);
    });
  };

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
                count: fulfilledRequirementsCount,
                total: requirements.length,
              })}
            </StyledPublishRequirementsLabelCount>
          </StyledPublishRequirementsLabel>
          <StyledPublishRequirementsItems>
            {requirements.map((requirement, index) => (
              <Requirement key={index} {...requirement} link={requirement?.link} />
            ))}
          </StyledPublishRequirementsItems>
        </StyledPublishRequirements>
        <StyledPublishAction>
          <Button
            size={ButtonSize.big}
            color={ButtonColor.green}
            icon="Heart"
            disabled={!publishable}
            css={css`
              box-shadow: 0.125rem 0.125rem 1.75rem -0.25rem rgba(0, 131, 92, 0.35);

              ${publishable &&
              css`
                &:hover {
                  box-shadow: 0.125rem 0.125rem 2.25rem -0.25rem rgba(0, 131, 92, 0.55);
                  transform: translateY(-0.125rem);
                }

                &:active {
                  transform: translateY(0.125rem);
                }
              `}
            `}
            onClick={async () => {
                  try {
                    try {
                      await onPublish();
                    } catch (e) {
                      console.error(e);
                      return { success: false, error: t('general.serverProblem') };
                    }
                    const save = await waitForSave();
                    if (save.success) {
                      const resp = await call(category.api.update.factory, {
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
                    } else {
                      return { success: false, error: t('general.serverProblem') };
                    }
                  } catch (e) {
                    console.error(e);
                    return { success: false, error: t('general.serverProblem') };
                  }

            }}
          >
            {t('general.publish')}
          </Button>
        </StyledPublishAction>
      </StyledPublishBody>
    </StyledPublish>
  );
};

export const usePublish = ({
  category,
  query,
  formRequirementFulfillments,
  onPublish,
}: {
  category: Category;
  query: ParsedUrlQuery;
  onPublish: () => Promise<void>;
  formRequirementFulfillments?: RequirementFulfillment[];
}): {
  renderedPublish: React.ReactElement<PublishProps>;
} => {
  const router = useRouter();
  const { entry } = useEntry(category, router?.query);

  const requirements = category?.requirements;

  const failedRequirementsFromApi =
    typeof entry?.meta?.publishable === 'object' &&
    Object.entries(entry?.meta?.publishable).length > 0
      ? entry?.meta?.publishable
      : undefined;

  const stateRequirements = useMemo(
    () =>
      requirements.map((requirement) => {
        const stateFulfillment = formRequirementFulfillments?.find(
          ({ requirementKey }) => requirement?.key === requirementKey
        );

        return {
          text: requirement.translation,
          fulfilled:
            stateFulfillment && typeof stateFulfillment.fulfilled === 'boolean'
              ? stateFulfillment.fulfilled
              : requirement.publishableKeys.reduce((fulfilled, publishableKey) => {
                  if (
                    failedRequirementsFromApi &&
                    failedRequirementsFromApi.hasOwnProperty(publishableKey)
                  ) {
                    return false;
                  }

                  return fulfilled;
                }, true),
          link: requirement.link
            ? {
                href: requirement.link?.href(query),
                ariaLabel: requirement.link.ariaLabel,
              }
            : undefined,
        };
      }),
    [formRequirementFulfillments, failedRequirementsFromApi, requirements, query]
  );

  return {
    renderedPublish:
      entry?.data?.attributes?.status === PublishedStatus.draft ? (
        <Publish
          category={category}
          query={query}
          requirements={stateRequirements}
          onPublish={onPublish}
        />
      ) : null,
  };
};
