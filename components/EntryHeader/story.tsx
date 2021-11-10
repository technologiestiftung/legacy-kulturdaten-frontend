import { Story } from '@storybook/react';
import { EntryHeader } from '.';
import { useT } from '../../lib/i18n';
import { Button, ButtonColor, ButtonSize, ButtonVariant, IconPosition } from '../button';
import { DropdownMenu, DropdownMenuForm } from '../DropdownMenu';
import { Tabs } from '../navigation/tabs';

export default {
  title: 'Entry Header',
};

const testTabLinks = [
  {
    title: 'Informationen',
    href: '#',
    isActive: true,
  },
  {
    title: 'Kategorisierung',
    href: '#',
  },
  {
    title: 'Bilder',
    href: '#',
  },
  {
    title: 'Vorschau',
    href: '#',
  },
];

export const EntryHeaderDefaultStory: Story = () => {
  const t = useT();

  return (
    <EntryHeader
      backButton={
        <Button icon="ArrowLeft" iconPosition={IconPosition.left} variant={ButtonVariant.minimal}>
          zurück
        </Button>
      }
      menu={
        <DropdownMenu
          icon="Sliders"
          text={t('general.actions') as string}
          form={DropdownMenuForm.rounded}
          buttonAriaLabels={{
            open: t('general.actionsOpen') as string,
            close: t('general.actionsClose') as string,
          }}
        >
          <Button
            variant={ButtonVariant.minimal}
            size={ButtonSize.default}
            color={ButtonColor.white}
            onClick={() => alert('Download startet')}
          >
            Export als CSV
          </Button>
          <Button
            variant={ButtonVariant.minimal}
            size={ButtonSize.default}
            color={ButtonColor.white}
            onClick={() => alert('Download startet')}
          >
            Export als Excel
          </Button>
          <Button
            variant={ButtonVariant.minimal}
            size={ButtonSize.default}
            color={ButtonColor.black}
          >
            Lösche Eintrag
          </Button>
        </DropdownMenu>
      }
      title="This is a very long title"
      tabs={<Tabs links={testTabLinks} />}
    />
  );
};
