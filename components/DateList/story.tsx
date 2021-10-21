import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import { useDateList } from '.';
import { Language } from '../../config/locale';
import { Breakpoint } from '../../lib/WindowService';
import { contentGrid, mq } from '../globals/Constants';
import { OfferDate, OfferDateStatus } from '../../lib/api/types/offer';

const dummyDates: OfferDate[] = [
  {
    data: {
      id: 0,
      attributes: {
        startsAt: '2021-09-12T14:30:00',
        endsAt: '2021-09-12T17:30:00',
        status: OfferDateStatus.scheduled,
        ticketUrl: 'https://ticket.link',
      },
      relations: {
        translations: [
          {
            id: 0,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.de,
              name: 'Dummy Termin 0',
            },
          },
          {
            id: 1,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.en,
              name: 'Dummy Date 0',
            },
          },
        ],
      },
    },
  },
  {
    data: {
      id: 1,
      attributes: {
        startsAt: '2021-09-14T00:00:00',
        endsAt: '2021-09-14T00:00:00',
        status: OfferDateStatus.canceled,
        ticketUrl: 'https://ticket.link',
      },
      relations: {
        translations: [
          {
            id: 10,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.de,
              name: 'Dummy Termin 1',
            },
          },
          {
            id: 11,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.en,
              name: 'Dummy Date 1',
            },
          },
        ],
      },
    },
  },
  {
    data: {
      id: 2,
      attributes: {
        startsAt: '2021-09-16T00:00:00',
        endsAt: '2021-09-18T00:00:00',
        status: OfferDateStatus.scheduled,
        ticketUrl: 'https://ticket.link',
      },
      relations: {
        translations: [
          {
            id: 10,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.de,
              name: 'Dummy Termin 2',
            },
          },
          {
            id: 11,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.en,
              name: 'Dummy Date 2',
            },
          },
        ],
      },
    },
  },
  {
    data: {
      id: 3,
      attributes: {
        startsAt: '2021-09-20T12:00:00',
        endsAt: '2021-09-21T16:00:00',
        status: OfferDateStatus.scheduled,
        ticketUrl: 'https://ticket.link',
      },
      relations: {
        translations: [
          {
            id: 10,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.de,
              name: 'Dummy Termin 3',
            },
          },
          {
            id: 11,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.en,
              name: 'Dummy Date 3',
            },
          },
        ],
      },
    },
  },
  {
    data: {
      id: 4,
      attributes: {
        startsAt: '2021-09-22T20:00:00',
        endsAt: '2021-09-22T23:00:00',
        status: OfferDateStatus.scheduled,
        ticketUrl: 'https://ticket.link',
      },
      relations: {
        translations: [
          {
            id: 10,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.de,
              name: 'Dummy Termin 4',
            },
          },
          {
            id: 11,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.en,
              name: 'Dummy Date 4',
            },
          },
        ],
      },
    },
  },
  {
    data: {
      id: 5,
      attributes: {
        startsAt: '2021-09-24T12:00:00',
        endsAt: '2021-09-24T15:30:00',
        status: OfferDateStatus.canceled,
        ticketUrl: 'https://ticket.link',
      },
      relations: {
        translations: [
          {
            id: 10,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.de,
              name: 'Dummy Termin 5',
            },
          },
          {
            id: 11,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.en,
              name: 'Dummy Date 5',
            },
          },
        ],
      },
    },
  },
  {
    data: {
      id: 6,
      attributes: {
        startsAt: '2021-09-25T00:00:00',
        endsAt: '2021-10-01T00:00:00',
        status: OfferDateStatus.canceled,
        ticketUrl: 'https://ticket.link',
      },
      relations: {
        translations: [
          {
            id: 10,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.de,
              name: '',
            },
          },
          {
            id: 11,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.en,
              name: '',
            },
          },
        ],
      },
    },
  },
  {
    data: {
      id: 7,
      attributes: {
        startsAt: '2021-09-27T14:00:00',
        endsAt: '2021-09-27T16:00:00',
        status: OfferDateStatus.scheduled,
        ticketUrl: 'https://ticket.link',
      },
      relations: {
        translations: [
          {
            id: 10,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.de,
              name: 'Dummy Termin 7',
            },
          },
          {
            id: 11,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.en,
              name: 'Dummy Date 7',
            },
          },
        ],
      },
    },
  },
];

export default {
  title: 'Date List',
};

const StoryWrapper = styled.div`
  padding: 2rem 0;
  ${contentGrid(8)}
`;

const StoryContainer = styled.div`
  grid-column: 1 / -1;

  ${mq(Breakpoint.mid)} {
    padding: 0 1.5rem;
  }

  ${mq(Breakpoint.wide)} {
    padding: 0;
    grid-column: 2 / -2;
  }
`;

const EmbeddedStory: React.FC = () => {
  const { renderedDateList } = useDateList({
    dates: dummyDates.map((date) => date.data),
    offerTitles: {
      [Language.de]: 'Angebotstitel',
      [Language.en]: 'Offer title',
    },
  });

  return (
    <StoryWrapper>
      <StoryContainer>{renderedDateList}</StoryContainer>
    </StoryWrapper>
  );
};

export const DateListDefaultStory: Story = () => <EmbeddedStory />;
