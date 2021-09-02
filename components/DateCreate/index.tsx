import { css } from '@emotion/react';
import { useCallback } from 'react';
import { OfferDate } from '../../lib/api/types/offer';
import { useT } from '../../lib/i18n';
import { Button, ButtonColor, ButtonSize } from '../button';
import { useOverlay } from '../overlay';
import { OverlayTitleBar } from '../overlay/OverlayTitleBar';

const DateCreateForm: React.FC = () => {
  return <div>form</div>;
};

interface DateCreateProps {
  onSubmit: (date: OfferDate) => void;
  offerTitle: string;
}

export const DateCreate: React.FC<DateCreateProps> = ({
  onSubmit,
  offerTitle,
}: DateCreateProps) => {
  const t = useT();

  const { renderedOverlay, isOpen, setIsOpen } = useOverlay(
    <>
      <OverlayTitleBar
        title={t('dateCreate.overlayTitle', { offerTitle }) as string}
        actions={[
          <Button key={0} color={ButtonColor.black} onClick={() => submitHandler()}>
            {t('dateCreate.create')}
          </Button>,
        ]}
      />
      <DateCreateForm />
    </>,
    true
  );

  const submitHandler = useCallback(() => {
    onSubmit(undefined);
    setIsOpen(false);
  }, [onSubmit, setIsOpen]);

  return (
    <div>
      <Button
        onClick={() => setIsOpen(true)}
        size={ButtonSize.big}
        icon="Plus"
        css={css`
          width: 100%;
        `}
        color={ButtonColor.white}
      >
        {t('dateCreate.create')}
      </Button>
      {renderedOverlay}
    </div>
  );
};
