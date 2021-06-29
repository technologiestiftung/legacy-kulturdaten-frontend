import styled from '@emotion/styled';
import { contentGrid, mq } from '../../globals/Constants';
import { CategoryEntryPage, useEntry } from '../../../lib/categories';
import { Breakpoint } from '../../../lib/WindowService';
import { Organizer } from '../../../lib/api/types/organizer';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';
import { useLanguage } from '../../../lib/routing';
import { getTranslation } from '../../../lib/translations';
import { useT } from '../../../lib/i18n';

const EntryContainer = styled.div`
  ${contentGrid(4)}
  padding: 2.75rem 0;

  ${mq(Breakpoint.mid)} {
    ${contentGrid(16)}
    column-gap: 0.75rem;
  }
`;

const EntryMainCard = styled.div`
  position: relative;
  overflow: hidden;
  grid-column: 1/-1;
  margin: 0 0.75rem;
  padding-bottom: 0.75rem;

  background-color: var(--white);
  border: 1px solid var(--black);
  border-radius: 0.75rem;

  ${contentGrid(3)}

  ${mq(Breakpoint.mid)} {
    margin-top: 0.75rem;
    margin: 0;
    grid-column: 3 / 15;
    column-gap: 0.75rem;
  }
`;

const EntryTitle = styled.h2`
  grid-row: 1;
  grid-column: 1 / 3;
  padding: 1rem 1.5rem;

  font-size: var(--font-size-400);
  line-height: var(--line-height-600);
  font-weight: var(--font-weight-bold);

  ${mq(Breakpoint.mid)} {
    padding-bottom: 0.75rem;

    font-size: var(--font-size-600);
    line-height: var(--line-height-600);
  }
`;
const EntryDescription = styled.div`
  margin-bottom: 0.75rem;
  padding: 0 1.5rem;
  grid-row: 2;
  grid-column: 1 / 3;

  font-size: var(--font-size-200);
  line-height: var(--line-height-200);

  ${mq(Breakpoint.mid)} {
    font-size: var(--font-size-300);
    line-height: var(--line-height-300);
  }
`;

const EntryLogo = styled.div`
  display: block;
  overflow: hidden;
  margin-bottom: 1.75rem;
  grid-row: 1 / 3;
  grid-column: 3;

  img {
    display: block;
    width: 100%;
    min-width: 100%;
    border-top-right-radius: 0.75rem;
    border-bottom-left-radius: 0.75rem;
    border-left: 1px solid var(--black);
    border-bottom: 1px solid var(--black);
  }
`;

const EntryMetadata = styled.div`
  padding: 0.75rem 0;
  grid-row: 3;
  grid-column: 1 / 4;

  border-top: 1px solid var(--grey-400);

  ${mq(Breakpoint.mid)} {
    ${contentGrid(3)}
    column-gap: 0.75rem;
  }
`;

const EntryCategorization = styled.ul`
  padding: 0 1.5rem;
  margin-bottom: 0.75rem;
  grid-row: 4;
  grid-column: 1 / 3;

  font-size: var(--font-size-200);
  line-height: var(--line-height-200);

  ${mq(Breakpoint.mid)} {
    font-size: var(--font-size-300);
    line-height: var(--line-height-300);
  }
`;

const EntryType = styled.li`
  display: inline-block;
  padding-right: 0.75rem;
  margin-right: 0.75rem;
  position: relative;
  &::after {
    content: '|';
    display: block;
    position: absolute;
    right: -2px;
    top: 0;
  }
`;

const EntrySubject = styled.li`
  display: inline-block;
`;

const EntryTags = styled.ul`
  padding: 0 1.5rem;
  grid-row: 5;
  grid-column: 1 / 3;

  font-size: var(--font-size-200);
  line-height: var(--line-height-200);

  ${mq(Breakpoint.mid)} {
    font-size: var(--font-size-300);
    line-height: var(--line-height-300);
  }
`;

const Tag = styled.li`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  margin: 0 0.75rem 0.75rem 0;
  border: 1px solid var(--grey-400);
  border-radius: 6px;
`;

const EntryContact = styled.div`
  grid-row: 4 / 6;
  grid-column: 3;
  padding: 0 1.5rem;

  ${mq(Breakpoint.mid)} {
    padding: 0 1.5rem 0 0;
  }
`;

const EntryMetadataKey = styled.dd`
  padding-bottom: 0.125rem;

  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-200);
  line-height: var(--line-height-200);

  ${mq(Breakpoint.mid)} {
    font-size: var(--font-size-300);
    line-height: var(--line-height-200);
  }
`;

const EntryMetadataValue = styled.dt`
  margin-bottom: 1rem;

  font-size: var(--font-size-200);
  line-height: var(--line-height-200);

  a {
    color: var(--black);
  }

  ${mq(Breakpoint.mid)} {
    font-size: var(--font-size-300);
    line-height: var(--line-height-300);
  }
`;

const EntryPhotos = styled.div`
  grid-row: 7;
  grid-column: 1 / 4;

  img {
    display: block;
    max-width: 100%;
    width: 100%;
  }

  figure {
    display: grid;
    grid-template-rows: 1fr auto;
    margin-bottom: 0.75rem;
    break-inside: avoid;
  }

  figure > img {
    grid-row: 1 / -1;
    grid-column: 1;
  }

  figcaption {
    grid-row: 2;
    grid-column: 1;
    color: var(--white);
    background-color: var(--black-o40);
    padding: 0.25rem 0.5rem;
    justify-self: end;

    font-size: var(--font-size-100);
    line-height: var(--line-height-100);
  }

  ${mq(Breakpoint.mid)} {
    column-count: 4;
    column-gap: 10px;
  }
`;

export const OrganizerPreviewPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const { entry } = useEntry<Organizer, OrganizerShow>(category, query);
  const language = useLanguage();
  const currentTranslation = getTranslation(language, entry?.data?.relations?.translations);
  const title = currentTranslation?.attributes?.name;
  const t = useT();

  return (
    <EntryContainer>
      <EntryMainCard>
        <EntryTitle>{title}</EntryTitle>
        <EntryDescription>{currentTranslation?.attributes?.description}</EntryDescription>
        <EntryLogo>
          <img src="http://via.placeholder.com/800x800" alt="" />
        </EntryLogo>
        <EntryMetadata>
          <EntryCategorization>
            <EntryType>Museum</EntryType>
            <EntrySubject>Kunstmuseum, Designmuseum</EntrySubject>
          </EntryCategorization>
          <EntryTags>
            <Tag>Ensembles für Zeitgenössische Musik</Tag>
            <Tag>Ensembles für Alte Musik</Tag>
            <Tag>Instrumentalensemble</Tag>
            <Tag>Gemischter Chor</Tag>
            <Tag>Frauenchor</Tag>
            <Tag>Männerchor</Tag>
            <Tag>Jugendchor</Tag>
            <Tag>Kinderchor</Tag>
          </EntryTags>
          <EntryContact>
            <EntryMetadataKey>{t('categories.organizer.form.website')}</EntryMetadataKey>
            <EntryMetadataValue>
              <a target="_blank" rel="noreferrer" href={entry?.data?.attributes?.homepage}>
                {entry?.data?.attributes?.homepage}
              </a>
            </EntryMetadataValue>
            <EntryMetadataKey>{t('categories.organizer.form.email')}</EntryMetadataKey>
            <EntryMetadataValue>
              <a target="_blank" rel="noreferrer" href={'mailto:' + entry?.data?.attributes?.email}>
                {entry?.data?.attributes?.email}
              </a>
            </EntryMetadataValue>
            <EntryMetadataKey>{t('categories.organizer.form.tel')}</EntryMetadataKey>
            <EntryMetadataValue>
              <a href={'tel:' + entry?.data?.attributes?.phone}>{entry?.data?.attributes?.phone}</a>
            </EntryMetadataValue>
          </EntryContact>
        </EntryMetadata>
        <EntryPhotos>
          <figure>
            <img src="http://via.placeholder.com/600x800" alt="" />
            <figcaption>License info</figcaption>
          </figure>
          <figure>
            <img src="http://via.placeholder.com/250x300" alt="" />
            <figcaption>License info</figcaption>
          </figure>
          <figure>
            <img src="http://via.placeholder.com/264x500" alt="" />
            <figcaption>License info</figcaption>
          </figure>
          <figure>
            <img src="http://via.placeholder.com/600x400" alt="" />
            <figcaption>License info</figcaption>
          </figure>
          <figure>
            <img src="http://via.placeholder.com/400x250" alt="" />
            <figcaption>License info</figcaption>
          </figure>
          <figure>
            <img src="http://via.placeholder.com/650x800" alt="" />
            <figcaption>License info</figcaption>
          </figure>
          <figure>
            <img src="http://via.placeholder.com/690x500" alt="" />
            <figcaption>License info</figcaption>
          </figure>
          <figure>
            <img src="http://via.placeholder.com/600x500" alt="" />
            <figcaption>License info</figcaption>
          </figure>
          <figure>
            <img src="http://via.placeholder.com/800x800" alt="" />
            <figcaption>License info</figcaption>
          </figure>
          <figure>
            <img src="http://via.placeholder.com/600x400" alt="" />
            <figcaption>License info</figcaption>
          </figure>
          <figure>
            <img src="http://via.placeholder.com/1400x1800" alt="" />
            <figcaption>License info</figcaption>
          </figure>
        </EntryPhotos>
      </EntryMainCard>
    </EntryContainer>
  );
};
